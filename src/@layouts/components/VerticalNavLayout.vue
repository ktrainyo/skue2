<script lang="ts" setup>
import { supabase } from '@/composables/useSupabase'
import fetchSolPrice from '@/services/solPriceService'
import { VerticalNav } from '@layouts/components'
import { useLayoutConfigStore } from '@layouts/stores/config'
import type { VerticalNavItems } from '@layouts/types'
import { syncRef, useToggle, useWindowSize } from '@vueuse/core'
import { computed, onMounted, ref, toRef, watch } from 'vue'

interface Props {
  navItems: VerticalNavItems
  verticalNavAttrs?: {
    wrapper?: string
    wrapperProps?: Record<string, unknown>
  }
}

const props = withDefaults(defineProps<Props>(), {
  verticalNavAttrs: () => ({}),
})

const { width: windowWidth } = useWindowSize()
const configStore = useLayoutConfigStore()

const isOverlayNavActive = ref(false)
const isLayoutOverlayVisible = ref(false)
const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)

// ℹ️ This is alternative to below two commented watcher
// We want to show overlay if overlay nav is visible and want to hide overlay if overlay is hidden and vice versa.
syncRef(isOverlayNavActive, isLayoutOverlayVisible)

// watch(isOverlayNavActive, value => {
//   // Sync layout overlay with overlay nav
//   isLayoutOverlayVisible.value = value
// })

// watch(isLayoutOverlayVisible, value => {
//   // If overlay is closed via click, close hide overlay nav
//   if (!value) isOverlayNavActive.value = false
// })

// ℹ️ Hide overlay if user open overlay nav in <md and increase the window width without closing overlay nav
watch(windowWidth, () => {
  if (!configStore.isLessThanOverlayNavBreakpoint && isLayoutOverlayVisible.value)
    isLayoutOverlayVisible.value = false
})

const verticalNavAttrs = computed(() => {
  const vNavAttrs = toRef(props, 'verticalNavAttrs')

  const { wrapper: verticalNavWrapper, wrapperProps: verticalNavWrapperProps, ...additionalVerticalNavAttrs } = vNavAttrs.value

  return {
    verticalNavWrapper,
    verticalNavWrapperProps,
    additionalVerticalNavAttrs,
  }
})

// Fetch SOL price and display it in the header
const solPrice = ref<number | null>(null)

const updateSolPrice = async () => {
  console.log('Fetching SOL price...')
  const price = await fetchSolPrice()
  if (price !== null) {
    solPrice.value = price
    console.log('SOL price fetched:', price)
  } else {
    console.error('Failed to fetch SOL price')
  }
}

const fetchMostRecentSolPrice = async () => {
  const { data, error } = await supabase
    .from('sol_price')
    .select('price')
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching most recent SOL price:', error.message)
    return
  }

  if (data && data.length > 0) {
    solPrice.value = data[0].price
    console.log('Most recent SOL price fetched from Supabase:', solPrice.value)
  }
}

onMounted(() => {
  updateSolPrice()
  setInterval(updateSolPrice, 300000) // Fetch every 5 minutes
  fetchMostRecentSolPrice()
})
</script>

<template>
  <div
    class="layout-wrapper"
    :class="configStore._layoutClasses"
  >
    <component
      :is="verticalNavAttrs.verticalNavWrapper ? verticalNavAttrs.verticalNavWrapper : 'div'"
      v-bind="verticalNavAttrs.verticalNavWrapperProps"
      class="vertical-nav-wrapper"
    >
      <VerticalNav
        :is-overlay-nav-active="isOverlayNavActive"
        :toggle-is-overlay-nav-active="toggleIsOverlayNavActive"
        :nav-items="props.navItems"
        v-bind="{ ...verticalNavAttrs.additionalVerticalNavAttrs }"
      >
        <template #nav-header>
          <slot name="vertical-nav-header" />
        </template>
        <template #before-nav-items>
          <slot name="before-vertical-nav-items" />
        </template>
      </VerticalNav>
    </component>
    <div class="layout-content-wrapper">
      <header
        class="layout-navbar"
        :class="[{ 'navbar-blur': configStore.isNavbarBlurEnabled }]"
      >
        <div class="navbar-content-container">
          <slot
            name="navbar"
            :toggle-vertical-overlay-nav-active="toggleIsOverlayNavActive"
          />
          <div class="sol-price-box">
            <span class="sol-price-label">SOL Price:</span>
            <span class="sol-price-value">{{ solPrice !== null ? `$${solPrice}` : 'Loading...' }}</span>
          </div>
        </div>
      </header>
      <main class="layout-page-content">
        <div class="page-content-container">
          <slot />
        </div>
      </main>
      <footer class="layout-footer">
        <div class="footer-content-container">
          <slot name="footer" />
        </div>
      </footer>
    </div>
    <div
      class="layout-overlay"
      :class="[{ visible: isLayoutOverlayVisible }]"
      @click="() => { isLayoutOverlayVisible = !isLayoutOverlayVisible }"
    />
  </div>
</template>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// Removed duplicate .navbar-content-container

.navbar-content-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.layout-wrapper.layout-nav-type-vertical {
  // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
  block-size: 100%;

  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    transition: padding-inline-start 0.2s ease-in-out;
    will-change: padding-inline-start;

    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-width;
    }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            @include mixins.boxed-content;
          }
          /* stylelint-disable-next-line @stylistic/indentation */
          @else {
            .navbar-content-container {
              @include mixins.boxed-content;
            }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  // 👉 Footer
  .layout-footer {
    @include mixins.boxed-content;
  }

  // 👉 Layout overlay
  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: opacity;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // Adjust right column pl when vertical nav is collapsed
  &.layout-vertical-nav-collapsed .layout-content-wrapper {
    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Content height fixed
  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden;

      .page-content-container {
        inline-size: 100%;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}

.layout-wrapper {
  display: flex;
  flex-direction: column;
  block-size: 100vh;
}

.sol-price-box {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #2e2e2e;
}

.sol-price-label {
  color: #aaa;
  font-size: 0.75rem;
  margin-inline-end: 0.5rem;
}

.sol-price-value {
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
}
</style>
