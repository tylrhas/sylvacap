<template>
<v-card>
  <v-data-table
  :headers='headers'
  :items='stocks'
  :items-per-page="itemsPerPage"
  :search="search"
  class='elevation-1'
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-card-title>
      Stocks
      </v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model='dialog' max-width='500px'>
          <template v-slot:activator='{ on }'>
            <v-btn color='primary' dark class='mb-2' v-on='on'>New Stock</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class='headline'>formTitle</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols='12' sm='6' md='4'>
                    <v-text-field v-model='editedItem.name' label='Company Name'></v-text-field>
                  </v-col>
                  <v-col cols='12' sm='6' md='4'>
                    <v-text-field v-model='editedItem.symbol' label='Ticker Symbol'></v-text-field>
                  </v-col>
                  <v-col cols='12' sm='6' md='4'>
                    <v-text-field v-model='editedItem.datePurchased' label='Date Purchased'></v-text-field>
                  </v-col>
                  <v-col cols='12' sm='6' md='4'>
                    <v-text-field v-model='editedItem.purchasePrice' label='Purchase Price'></v-text-field>
                  </v-col>
                  <v-col cols='12' sm='6' md='4'>
                    <v-text-field v-model='editedItem.dateSold' label='Date Sold'></v-text-field>
                  </v-col>
                  <v-col cols='12' sm='6' md='4'>
                    <v-text-field v-model='editedItem.soldPrice' label='Sold Price'></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color='blue darken-1' text @click='close'>Cancel</v-btn>
              <v-btn color='blue darken-1' text @click='save'>Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action='{ item }'>
      <v-icon small class='mr-2' @click='editItem(item)'>edit</v-icon>
      <v-icon small @click='deleteItem(item)'>delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color='primary' @click='initialize'>Reset</v-btn>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      itemsPerPage: 100,
      dialog: false,
      headers: [
        { text: 'Name', value: 'name', align: 'left', sortable: false },
        { text: 'Ticker Symbol', value: 'symbol' },
        { text: 'Date Purchased', value: 'datePurchased' },
        { text: 'Purchase Price', value: 'purchasePrice' },
        { text: 'Date Sold', value: 'dateSold' },
        { text: 'Sold Price', value: 'soldPrice' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      stocks: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        symbol: '',
        datePurchased: '01/01/2019',
        purchasePrice: 0,
        dateSold: '01/01/2019',
        soldPrice: 0
      },
      defaultItem: {
        name: '',
        symbol: '',
        datePurchased: '01/01/2019',
        purchasePrice: 0,
        dateSold: '01/01/2019',
        soldPrice: 0
      }
    }
  },
  created () {
    this.$axios.$get('/api/stocks').then((res) => {
      this.stocks = res
    })
  },
  methods: {

    editItem (item) {
      this.editedIndex = this.stocks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.stocks.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.stocks.splice(index, 1)
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.stocks[this.editedIndex], this.editedItem)
      } else {
        this.stocks.unshift(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
