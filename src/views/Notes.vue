<template>
    <div class="container">
        <h1>Notes</h1>

        <b-alert
        :show="dismissCountDown"
        dismissible
        :variant="mensaje.color"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
        >
        {{mensaje.texto}}
        </b-alert>

        <div class="my-5" v-if="!edit">
        <b-form inline @submit.prevent="addNote()">
            <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Name"
            v-model="note.name"
            ></b-form-input>

             <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Description"
            v-model="note.description"
            ></b-form-input>

            <b-button variant="primary" type="submit">Save</b-button>
        </b-form>
        </div>

        <div class="my-5" v-if="edit">
        <b-form inline @submit.prevent="editNote(noteEdit)">
            <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Name"
            v-model="noteEdit.name"
            ></b-form-input>

             <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Description"
            v-model="noteEdit.description"
            ></b-form-input>

            <b-button variant="warning" type="submit">Edit</b-button>
            <b-button variant="" class="mx-2" @click="edit = false">Back</b-button>
        </b-form>
        </div>

        <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody v-for="item in notes" :key="item.id">
            <tr>
            <th scope="row">{{item._id}}</th>
            <td>{{item.name}}</td>
            <td>{{item.description}}</td>
            <td>
                <b-button variant="warning" class="mx-2" @click="activeForm(item._id)">Update</b-button>
                <b-button variant="danger" class="mx-2" @click="deleteNote(item._id)">Delete</b-button>
            </td>
            </tr>
        </tbody>
        </table>
        <p>Total notas: {{totalNotas}} - Cantidad de páginas: {{cantidadPaginas}}</p>
        <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled': paginaActual === 1}">
            <router-link class="page-link" :to="{ query: { pagina: paginaActual - 1 }}">Anterior</router-link>
            </li>
            <li class="page-item" :class="{'active':paginaActual === index + 1}"
            v-for="(item, index) in cantidadPaginas" :key="index">
            <router-link :to="{ query: { pagina: index + 1 }}" class="page-link">{{index + 1}}</router-link>
            </li>
            <li class="page-item" :class="{'disabled': paginaActual === cantidadPaginas}">
            <router-link class="page-link" :to="{ query: { pagina: paginaActual + 1 }}">Siguiente</router-link>
            </li>
        </ul>
        </nav>


    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            totalNotas: 0,
            limite: 5,
            paginaActual: 1,

            notes: [],
            dismissSecs: 5,
            dismissCountDown: 0,
            mensaje: {color: 'success', texto: ''},
            note: {name: '', description: ''},
            edit: false,
            add: true,
            noteEdit: {}
        }
    },
    // created() {
    //    this.listNotes();
    // },
    watch: {
        "$route.query.pagina": {
            immediate: true,
            handler(pagina) {
            pagina = parseInt(pagina) || 1;
            console.log('pagina', pagina);
            this.paginacion(pagina);
            this.paginaActual = pagina
            }
        }
    },
    computed: {
        ...mapState(['token']),
        cantidadPaginas() {
        return Math.ceil(this.totalNotas / this.limite);
    }
    },
    methods: {
        paginacion(pagina){
            let config = {
                headers: {
                    token: this.token
                }
            };

            let skip = (pagina - 1) * this.limite;
            this.axios
            .get(`/note-all?skip=${skip}&limit=${this.limite}`, config)
                .then(resp => {
                    console.log(resp.data.notaDB);
                    this.notes = resp.data.notaDB;
                    this.totalNotas = resp.data.totalNote;
                    console.log('total notas', resp.data.totalNote);
                })
                .catch(e => {
                    console.log(e.response);
                })
        },
        listNotes(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('/note-all', config)
            .then(resp => {
                console.log(resp.data.notaDB);
                this.notes = resp.data.notaDB;
            })
            .catch(e => {
                console.log(e.response);
            })
        },

        clearData(){
            this.note.name = '',
            this.note.description = ''
        },

        addNote(){
            let config = {
                headers: {
                token: this.token
                }
            }
            this.axios.post('/add-note', this.note, config)
                .then(resp => {
                    this.notes.push(resp.data);
                    this.clearData();
                    this.mensaje.color = "success",
                    this.mensaje.texto = "Nota Agregada !!",
                    this.showAlert();
                })
                .catch(e => {
                    console.log(e.response.data.error.errors.name.message);
                    this.mensaje.color = "danger",
                    this.mensaje.texto = e.response.data.error.errors.name.message,
                    this.showAlert();
                })
        },
        activeForm(id){
            this.edit = true;
            this.axios.get(`note/${id}`)
                .then(resp => {
                   this.noteEdit = resp.data
                })
                .catch(e => {
                    console.log(e);
                })
        },

        editNote(item){
            this.axios.put(`note/${item._id}`, item)
                .then(resp => {
                    let index = this.notes.findIndex(n => n._id === resp.data._id);
                    this.notes[index].name = resp.data.name;
                    this.notes[index].description = resp.data.description;
            
                    this.mensaje.color = "success",
                    this.mensaje.texto = "Nota Editada !!",
                    this.showAlert();
                    this.edit = false;
                })
                .catch(e => {
                    console.log(e);
                })
               
        },

        deleteNote(id){
            this.axios.delete(`note/${id}`)
                .then(resp => {
                    let index = this.notes.findIndex(item => item._id === resp.data._id)
                    this.notes.splice(index, 1);

                    this.mensaje.texto = "Nota Eliminada !!"
                    this.mensaje.color = "success"
                    this.showAlert();
                })
                .catch(e => {
                    console.log(e);
                })
        },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    }
    },
}
</script>

<style>
    
</style>

