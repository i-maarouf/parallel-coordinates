<template>
  <div class="flex">
    <UDashboardPanel :width="300" :resizable="{ min: 200, max: 400 }">
      <UDashboardNavbar>
        <template #left>
          <img src="/ClientLogo.jpeg" width="150px" alt="" srcset="" />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Favourites",
    icon: "i-heroicons-inbox",
    to: "/favourites",
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
];
</script>
