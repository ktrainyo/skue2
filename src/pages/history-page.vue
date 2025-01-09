<template>
  <div class="call-static-tokens-historical-page">
    <h2>Call Static Tokens Historical</h2>

    <div class="box">
      <!-- 
        We pass the table name to fetch real-time data,
        then use the slot to get { fetchedData } in the parent.
      -->
      <SupabaseRealtimeDisplay tableName="call_static_tokens_historical" v-slot="{ fetchedData }">
        <div v-if="fetchedData.length === 0">No data available</div>
        <div v-else>
          <!-- 1) Simple Table View -->
          <div class="bordered-section">
            <h3>1) Simple Table View</h3>
            <v-data-table
              :headers="tableHeaders"
              :items="fetchedData"
              item-value="id"
              class="elevation-1"
            >
              <template v-slot:item.is_buy="{ item }">
                <v-chip :color="item.is_buy ? 'green' : 'red'" dark>
                  {{ item.is_buy ? 'BUY' : 'SELL' }}
                </v-chip>
              </template>
            </v-data-table>
          </div>

          <!-- 2) Cards View -->
          <div class="bordered-section">
            <h3>2) Cards View</h3>
            <v-row>
              <v-col
                cols="12"
                md="6"
                lg="4"
                v-for="item in fetchedData"
                :key="item.id"
              >
                <v-card>
                  <v-card-title>{{ item.token }}</v-card-title>
                  <v-card-subtitle>Price: {{ item.price }}</v-card-subtitle>
                  <v-chip :color="item.is_buy ? 'green' : 'red'" dark>
                    {{ item.is_buy ? 'BUY' : 'SELL' }}
                  </v-chip>
                  <v-card-text>
                    <small>Hash: {{ item.hash }}</small>
                    <br />
                    <small>Timestamp: {{ item.timestamp }}</small>
                    <br />
                    <small>Sol Amount: {{ item.sol_amount }}</small>
                    <br />
                    <small>Token Amount: {{ item.token_amount }}</small>
                    <br />
                    <small>DEX: {{ item.dex }}</small>
                    <br />
                    <small>Buyer: {{ item.buyer }}</small>
                    <br />
                    <small>Virtual Sol Reserves: {{ item.virtual_sol_reserves }}</small>
                    <br />
                    <small>Virtual Token Reserves: {{ item.virtual_token_reserves }}</small>
                    <br />
                    <small>Real Sol Reserves: {{ item.real_sol_reserves }}</small>
                    <br />
                    <small>Real Token Reserves: {{ item.real_token_reserves }}</small>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- 3) Chart View (Price Over Time) -->
          <div class="bordered-section">
            <h3>3) Chart View (Price Over Time)</h3>
            <apexchart
              v-if="fetchedData.length"
              type="line"
              height="300"
              :options="chartOptions"
              :series="getChartSeries(fetchedData)"
            />
          </div>

          <!-- 4) Timeline / Activity Feed -->
          <div class="bordered-section">
            <h3>4) Timeline / Activity Feed</h3>
            <v-timeline>
              <v-timeline-item
                v-for="item in sortedData(fetchedData)"
                :key="item.id"
                :color="item.is_buy ? 'green' : 'red'"
              >
                <template #opposite>
                  {{ item.timestamp }}
                </template>
                <template #default>
                  {{ item.token }} <v-chip :color="item.is_buy ? 'green' : 'red'" dark>
                    {{ item.is_buy ? 'BUY' : 'SELL' }}
                  </v-chip>
                  Price: {{ item.price }}
                  <br />
                  Sol Amount: {{ item.sol_amount }}
                  <br />
                  Token Amount: {{ item.token_amount }}
                  <br />
                  DEX: {{ item.dex }}
                  <br />
                  Buyer: {{ item.buyer }}
                  <br />
                  Virtual Sol Reserves: {{ item.virtual_sol_reserves }}
                  <br />
                  Virtual Token Reserves: {{ item.virtual_token_reserves }}
                  <br />
                  Real Sol Reserves: {{ item.real_sol_reserves }}
                  <br />
                  Real Token Reserves: {{ item.real_token_reserves }}
                </template>
              </v-timeline-item>
            </v-timeline>
          </div>

          <!-- 5) Modal Detail -->
          <div class="bordered-section">
            <h3>5) Modal Detail</h3>
            <v-data-table
              :headers="tableHeaders"
              :items="fetchedData"
              item-value="id"
              class="elevation-1"
              @click:row="openModal"
            ></v-data-table>

            <v-dialog v-model="showModal" max-width="600px">
              <v-card v-if="selectedItem">
                <v-card-title>Transaction Details</v-card-title>
                <v-card-text>
                  <div><strong>ID:</strong> {{ selectedItem.id }}</div>
                  <div><strong>Token:</strong> {{ selectedItem.token }}</div>
                  <div><strong>Price:</strong> {{ selectedItem.price }}</div>
                  <div><strong>Is Buy:</strong> {{ selectedItem.is_buy }}</div>
                  <div><strong>Hash:</strong> {{ selectedItem.hash }}</div>
                  <div><strong>Timestamp:</strong> {{ selectedItem.timestamp }}</div>
                  <div><strong>Sol Amount:</strong> {{ selectedItem.sol_amount }}</div>
                  <div><strong>Token Amount:</strong> {{ selectedItem.token_amount }}</div>
                  <div><strong>DEX:</strong> {{ selectedItem.dex }}</div>
                  <div><strong>Buyer:</strong> {{ selectedItem.buyer }}</div>
                  <div><strong>Virtual Sol Reserves:</strong> {{ selectedItem.virtual_sol_reserves }}</div>
                  <div><strong>Virtual Token Reserves:</strong> {{ selectedItem.virtual_token_reserves }}</div>
                  <div><strong>Real Sol Reserves:</strong> {{ selectedItem.real_sol_reserves }}</div>
                  <div><strong>Real Token Reserves:</strong> {{ selectedItem.real_token_reserves }}</div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </SupabaseRealtimeDisplay>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Token', value: 'token' },
        { text: 'Price', value: 'price' },
        { text: 'Is Buy', value: 'is_buy' },
        { text: 'Hash', value: 'hash' },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Sol Amount', value: 'sol_amount' },
        { text: 'Token Amount', value: 'token_amount' },
        { text: 'DEX', value: 'dex' },
        { text: 'Buyer', value: 'buyer' },
        { text: 'Virtual Sol Reserves', value: 'virtual_sol_reserves' },
        { text: 'Virtual Token Reserves', value: 'virtual_token_reserves' },
        { text: 'Real Sol Reserves', value: 'real_sol_reserves' },
        { text: 'Real Token Reserves', value: 'real_token_reserves' },
      ],
      showModal: false,
      selectedItem: null,
      chartOptions: {
        chart: {
          id: 'price-over-time',
        },
        xaxis: {
          type: 'datetime',
        },
      },
    };
  },
  methods: {
    openModal(item) {
      console.log('Opening modal for item:', item);
      this.selectedItem = item;
      this.showModal = true;
    },
    getChartSeries(fetchedData) {
      console.log('Transforming fetchedData for chart:', fetchedData);
      return [
        {
          name: 'Price',
          data: fetchedData.map(item => ({
            x: new Date(item.timestamp),
            y: item.price,
          })),
        },
      ];
    },
    sortedData(fetchedData) {
      console.log('Sorting fetchedData:', fetchedData);
      return fetchedData.slice().sort((a, b) => a.timestamp - b.timestamp);
    },
  },
  watch: {
    fetchedData(newData) {
      console.log('Fetched data updated:', newData);
    }
  }
};
</script>

<style scoped>
.call-static-tokens-historical-page {
  padding: 1rem;
}

.bordered-section {
  padding: 1rem;
  border: 1px solid #ccc;
}

.box {
  padding: 16px;
  border: 1px solid #ccc;
  max-block-size: 400px;
  overflow-y: auto;
}
</style>
