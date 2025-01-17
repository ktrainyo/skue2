<template>
  <div class="message-display">
    <v-snackbar
      v-for="(message, index) in filteredMessages"
      :key="index"
      :color="getMessageColor(message.type)"
      :timeout="5000"
      :content-class="computedContentClass"
      top
      right
    >
      {{ message.content }}
      <template v-slot:actions>
        <v-btn
          icon
          @click="removeMessage(index)"
          v-bind="attrs"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-btn
      v-if="isMinimized"
      icon
      @click="toggleMinimized"
      class="minimized-indicator"
    >
      <v-badge
        :content="unreadCount"
        color="green"
        overlap
      >
        <v-icon>mdi-bell</v-icon>
      </v-badge>
    </v-btn>

    <v-card v-else class="expanded-display">
      <v-card-title>
        <span>Messages</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="clearMessages">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon @click="toggleMinimized">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="searchQuery"
          label="Search messages"
          clearable
        ></v-text-field>
        <v-list>
          <v-list-item
            v-for="(message, index) in filteredMessages"
            :key="index"
          >
            <v-list-item-title :class="getMessageClass(message.type)">
              {{ message.content }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ message.timestamp }}
            </v-list-item-subtitle>
            <v-list-item-action>
              <v-btn icon @click="removeMessage(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import { VBadge, VBtn, VCard, VCardText, VCardTitle, VIcon, VList, VListItem, VListItemAction, VListItemSubtitle, VListItemTitle, VSnackbar, VSpacer, VTextField } from 'vuetify/components';

export default defineComponent({
  name: 'MessageDisplay',
  components: {
    VSnackbar,
    VBtn,
    VIcon,
    VBadge,
    VCard,
    VCardTitle,
    VCardText,
    VTextField,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VListItemAction,
    VSpacer,
  },
  props: {
    action: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const emitter = inject('emitter') as { on: (event: string, callback: Function) => void };
    const messages = ref<Array<{ id: string; content: string; timestamp: string; type: string }>>([]);
    const isMinimized = ref(true);
    const searchQuery = ref('');

    const logMessage = (content: string, type: string = 'info') => {
      const timestamp = new Date().toLocaleString();
      messages.value.push({ id: uuidv4(), content, timestamp, type });
    };

    const removeMessage = (index: number) => {
      messages.value.splice(index, 1);
    };

    const clearMessages = () => {
      messages.value = [];
    };

    const toggleMinimized = () => {
      isMinimized.value = !isMinimized.value;
    };

    const getMessageColor = (type: string) => {
      switch (type) {
        case 'error':
          return 'red';
        case 'warning':
          return 'orange';
        case 'info':
          return 'blue';
        default:
          return 'green';
      }
    };

    const getMessageClass = (type: string) => {
      switch (type) {
        case 'error':
          return 'error-message';
        case 'warning':
          return 'warning-message';
        case 'info':
          return 'info-message';
        default:
          return 'info-message';
      }
    };

    const unreadCount = computed(() => messages.value.length);

    const filteredMessages = computed(() => {
      if (!searchQuery.value) {
        return messages.value;
      }
      return messages.value.filter(message =>
        message.content.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const computedContentClass = computed(() => {
      return 'custom-content-class';
    });

    onMounted(() => {
      emitter.on('logMessage', (message: { content: string; type: string } & Record<string, any>) => {
        logMessage(message.content, message.type);
      });
    });

    return {
      messages,
      isMinimized,
      searchQuery,
      logMessage,
      removeMessage,
      clearMessages,
      toggleMinimized,
      getMessageColor,
      getMessageClass,
      unreadCount,
      filteredMessages,
      computedContentClass,
    };
  },
});
</script>

<style scoped>
.message-display {
  position: fixed;
  z-index: 1000;
  inset-block-end: 16px;
  inset-inline-end: 16px;
}

.minimized-indicator {
  position: fixed;
  inset-block-end: 16px;
  inset-inline-end: 16px;
}

.expanded-display {
  max-block-size: 600px;
  max-inline-size: 400px;
  overflow-y: auto;
}

.error-message {
  color: red;
}

.warning-message {
  color: orange;
}

.info-message {
  color: blue;
}

.custom-content-class {
  font-weight: bold;
}
</style>
