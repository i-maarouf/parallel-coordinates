<template>
  <div class="mainContainer w-full overflow-y-auto">
    <!-- <AppHeader /> -->
    <!-- 
    <UHorizontalNavigation :links="links" class="bg-primary-400">
   
    </UHorizontalNavigation> -->
    <div
      class="header flex items-center justify-between flex-col fixed w-full z-10"
    >
      <div
        class="mainHeader px-5 py-3 flex items-center justify-between w-full"
      >
        <div
          class="links text-white text-sm flex items-center justify-between gap-7"
        >
          <div class="linkActive link p-2" @click="navigateTo('/')">Home</div>
          <div class="p-2 disabled">About</div>
          <div class="p-2 disabled">Help</div>
        </div>
        <div class="logo">
          <img src="../public/enbix.jpeg" alt="" />
        </div>
      </div>
      <!-- <HorizontalNavigation /> -->
    </div>
    <slot />
    <!-- <AppFooter /> -->
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.mainHeader {
  background-color: #00355c;
}
.logo img {
  width: 100px;
}
.linkActive {
  border-radius: 5px;
  transition: all ease-in-out 0.3s;
  cursor: pointer;
}
.link:hover {
  background-color: #72737439;
}
.disabled {
  cursor: not-allowed;
  color: #cbcbce;
}
</style>
