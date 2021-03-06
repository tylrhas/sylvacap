<template>
  <div>
    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-container>
        <v-toolbar-title>
          <v-img
            src="/logo.png"
            max-width="100"
          />
        </v-toolbar-title>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="stocks"
            :disable-pagination="disablePagination"
            :hide-default-footer="hideDefaultFooter"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-card-title>
                  Portfolio
                </v-card-title>
                <v-spacer />
                <v-text-field
                  v-model="search"
                  label="Search"
                  single-line
                  hide-details
                />
                <v-spacer />
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">
                      New Stock
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">formTitle</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.name" label="Market Name" />
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.symbol" label="Symbol" />
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.year" label="Year" />
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.purchasePrice" label="Starting Price ($)" />
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.dateSold" label="% Change" />
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.soldPrice" label="Ending Price ($)" />
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="blue darken-1" text @click="close">
                        Cancel
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="save">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                edit
              </v-icon>
              <v-icon small @click="deleteItem(item)">
                delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      itemsPerPage: 100,
      disablePagination: true,
      hideDefaultFooter: true,
      dialog: false,
      headers: [
        { text: 'Name', value: 'name', align: 'left', sortable: false },
        { text: 'Symbol', value: 'symbol' },
        { text: 'Year', value: 'year' },
        { text: 'Starting Price ($)', value: 'purchasePrice' },
        { text: 'Ending Price ($)', value: 'soldPrice' },
        { text: '% Change', value: 'change' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      stocks: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        symbol: '',
        year: '2020',
        purchasePrice: 0,
        change: null,
        soldPrice: null
      },
      defaultItem: {
        name: '',
        symbol: '',
        year: '2020',
        purchasePrice: 0,
        change: null,
        soldPrice: null
      }
    }
  },
  created () {
    this.$axios.$get('/api/markets').then((res) => {
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
      confirm('Are you sure you want to delete this item?') && this.stocks.splice(index, 1) && this.$axios.$delete(`api/stocks/${item.id}`)
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
        this.$axios.$put('api/markets', this.editedItem)
        Object.assign(this.stocks[this.editedIndex], this.editedItem)
      } else {
        this.$axios.$post('api/markets', this.editedItem)
        this.stocks.unshift(this.editedItem)
      }
      this.close()
    }
  }
}
</script>
