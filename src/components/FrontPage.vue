<template>
<!-- code in template is creating GUI from Vue-components  -->
<!-- Code for making a responsive GUI using Vuetify components -->
<!-- We commented only the first reoccuring components in the <template> to avoid redundant information -->
  <v-container grid-list-md text-xs-center class="mt3">
    <v-layout row wrap>
    <v-flex>
      <!-- vuetify components for creating forms -->
      <!-- v-model is for built-in validation, see functions in methods -->
      <v-form 
        v-model="epokValidation.valid"
        ref="epok"
        >
        <v-container>
          <h2>Epok</h2>
          <!-- vuetify component creating as text-field for input. v-model maps the value in input field to variable in data-object (see <script> tag comments) -->
          <!-- :rules is mapped to variables in data-object that is used in validation -->
          <v-text-field
            v-model="courseCode"
            :rules="epokValidation.rules"
            label="Kurskod"
            required
          ></v-text-field>
          <v-text-field
            v-model="term"
            :rules="epokValidation.rules"
            label="Termin"
            required
          ></v-text-field>
          <!-- v-on:click maps a function in <script>-tag to a click on the button (button is a vuetify component) -->
          <v-btn
            :disabled="!epokValidation.valid"
            v-on:click="getApplicationCode"
            >Sök</v-btn>
          <v-text-field
            v-model="applicationCode"
            label="Anmälningskod"
          ></v-text-field>
          <!-- small component that is shown if API doesnt return results -->
          <div v-if="epokNoResults">Ingen anmälningskod hittades</div>
        </v-container>
      </v-form>
    </v-flex>
    <v-flex>
      <v-form v-model="idealValidation.valid">
        <h2>Ideal</h2>
        <v-container>
          <v-text-field
            v-model="idealId"
            :rules="idealValidation.rules"
            label="Idealanvändare"
            required
          ></v-text-field>

          <v-text-field
            v-model="openingCode"
            :rules="idealValidation.rules"
            label="Kurstillfälle"
            required
          ></v-text-field>
          <v-btn
            v-on:click="getPersonId"
            :disabled="!idealValidation.valid"
            >Hitta personnummer</v-btn>
          <v-text-field
            v-model="SSN"
            label="Personnummer"
          ></v-text-field>
          <div v-if="idealNoResults">Ingen student hittades</div>
        </v-container>
      </v-form>
    </v-flex>
    <v-flex>
      <v-form v-model="ladokValidation.valid">
        <v-container>
          <h2>Ladok</h2>
          <v-text-field
            v-model="SSN"
            :rules="ladokValidation.rules"
            label="Personnummer"
            required
          ></v-text-field>
          <v-text-field
            v-model="openingCode"
            :rules="ladokValidation.rules"
            label="Kurstillfälle"
            required
          ></v-text-field>
          <v-text-field
            v-model="examNumber"
            :rules="ladokValidation.rules"
            label="Provnummer"
            required
          ></v-text-field>
          <v-text-field
            v-model="date"
            :rules="ladokValidation.rules"
            label="Datum"
            required
          ></v-text-field>
          <v-text-field
            v-model="grade"
            :rules="ladokValidation.rules"
            label="Betyg"
            required
          ></v-text-field>
          <v-btn
            :disabled="!ladokValidation.valid"
            v-on:click="postGrade"
            >Registrera resultat</v-btn>
        </v-container>
        <v-snackbar
          v-model="snackbar"
        >
          Betyg registrerat!
          <v-btn
            color="pink"
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-form>
    </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable no-console */
/*  script tag is containt javascript code for storing, fetching and manipulating data */
export default {
  name: 'FrontPage',
  data: () => ({
    snackbar: false,
    epokNoResults: false,
    /* variables for validation of forms */
    idealNoResults: false,
    epokValidation: {
      valid: false,
      rules: [
        v => !!v || 'Fältet måste anges.',
      ],
    },
    idealValidation: {
      valid: false,
      rules: [
        v => !!v || 'Fältet måste anges.',
      ],
    },
    ladokValidation: {
      valid: false,
      rules: [
        v => !!v || 'Fältet måste anges.',
      ],
    },
    /* variables used together with forms (and v-model) to store data form input-fields, validate and then call API  */
    term: 'HT19',
    courseCode: 'D0031N', 
    applicationCode: '',
    idealId: 'gabwal-8',
    SSN: '',
    openingCode: '',
    examNumber: '',
    date: '',
    grade: '',
  }),
  methods: {
    /* method for calling epok-API, runs when user clicks the search-button  */
    getApplicationCode() {
      /*  calls API asynchronous with Axios and GET-request (baseURL provided in plugin-file) */
      /*  uses vairables from data in URL, for request, then handles result  */
      this.axios.get(`/epok/application?term=${this.term}&courseCode=${this.courseCode}`).then((result) => {
        /* if call is successful, stores data in variables */
        try {
          this.applicationCode = result.data.data.applicationCode;
          this.openingCode = this.applicationCode.replace('LTU-', '');
          this.epokNoResults = false;
        }
        /* if not successful error is thrown and no-result feedback-component is shown to user */
        catch(e) {
          this.epokNoResults = true;
        }
      });
    },
    getPersonId() {
      /*  calls API asynchronous with Axios and GET-request (baseURL provided in plugin-file) */
      /*  uses vairables from data in URL, for request, then handles result  */
      this.axios.get(`/ideal/student?idealId=${this.idealId}&openingCode=${this.openingCode}`).then((result) => {
         /* if call is successful, stores data in variables */
        try {
          this.SSN = result.data.data.SSN;
          this.idealNoResults = false;
        }
        /* if not successful error is thrown and no-result feedback-component is shown to user */
        catch (e) {
          this.idealNoResults = true;
        }
      });
    },
    postGrade() {
      /*  calls API asynchronous with Axios and POST-request (baseURL provided in plugin-file) */
      /* attached is a body /(JSON-object) with data from the variables that hold data from input fields */
      this.axios.post('/ladok/grade', {
        SSN: this.SSN,
        openingCode: this.openingCode,
        examNumber: this.examNumber,
        date: this.date,
        grade: this.grade,
      }).then(() => {
        this.snackbar = true;
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
