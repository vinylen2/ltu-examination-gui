<template>
  <v-container grid-list-md text-xs-center class="mt3">
    <v-layout row wrap>
    <v-flex>
      <v-form 
        v-model="epokValidation.valid"
        ref="epok"
        >
        <v-container>
          <h2>Epok</h2>
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
          <v-btn
            :disabled="!epokValidation.valid"
            v-on:click="getApplicationCode"
            >Sök</v-btn>
          <v-text-field
            v-model="applicationCode"
            label="Anmälningskod"
          ></v-text-field>
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
export default {
  name: 'FrontPage',
  data: () => ({
    snackbar: false,
    epokNoResults: false,
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
    getApplicationCode() {
      this.axios.get(`/epok/application?term=${this.term}&courseCode=${this.courseCode}`).then((result) => {
        try {
          this.applicationCode = result.data.data.applicationCode;
          this.openingCode = this.applicationCode.replace('LTU-', '');
          this.epokNoResults = false;
        }
        catch(e) {
          this.epokNoResults = true;
        }
      });
    },
    getPersonId() {
      this.axios.get(`/ideal/student?idealId=${this.idealId}&openingCode=${this.openingCode}`).then((result) => {
        try {
          this.SSN = result.data.data.SSN;
          this.idealNoResults = false;
        }
        catch (e) {
          this.idealNoResults = true;
        }
      });
    },
    postGrade() {
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
