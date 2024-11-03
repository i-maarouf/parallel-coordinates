<template>
  <UDashboardLayout>
    <UDashboardPanel
      :style="{
        width: isOpen ? '200px' : '60px',
        transition: 'width 0.3s ease',
      }"
      :resizable="{ min: 200, max: 300 }"
    >
      <UDashboardNavbar
        :class="{
          'flex-row navBarContainer': true,
          'p-2 navBarContainer': !isOpen,
          'p-4 navBarContainer': isOpen,
        }"
      >
        <template #left>
          <!-- <Logo class="w-auto h-5" /> -->
          <span v-if="isOpen">Dashboard Template</span>
          <UButton
            icon="i-material-symbols-left-panel-close"
            size="sm"
            color="primary"
            square
            variant="ghost"
            class="buttonUI"
            @click="toggleMenu()"
          >
            <template #trailing>
              <!-- <UIcon
                name="i-material-symbols-left-panel-close"
                class="w-5 h-5"
              /> -->
            </template>
          </UButton>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar v-show="isOpen">
        <UDashboardSidebarLinks :links="links" />
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />
  </UDashboardLayout>
</template>
<script>
export default {
  data() {
    return {
      links: [
        {
          label: "Home",
          icon: "i-heroicons-home",
          to: "/",
        },
        {
          label: "Inbox",
          icon: "i-heroicons-inbox",
          badge: "4",
        },
        {
          label: "Users",
          icon: "i-heroicons-user-group",
        },
        {
          label: "Settings",
          icon: "i-heroicons-cog-8-tooth",
          children: [
            {
              label: "General",
            },
            {
              label: "Members",
            },
            {
              label: "Notifications",
            },
          ],
        },
      ],
      isOpen: true,
    };
  },

  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
      console.log("isOpen", this.isOpen);
    },
  },
};
</script>
<style>
.buttonUI {
  padding: 0;
}
.navBarContainer > div > div {
  display: flex;
  width: 100% !important;
  justify-content: space-between !important;
}
</style>
