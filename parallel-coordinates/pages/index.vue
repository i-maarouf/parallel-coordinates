<template>
  <div
    class="flex flex-col items-center justify-start space-x-2 w-full px-5 py-20 overflow-y-auto h-dvh"
  >
    <UContainer class="2xl:w-3/4 2xl:max-w-7xl w-full max-w-full">
      <div class="text-container py-8">
        <div class="text-xl text-center font-bold">
          Welcome to Avenue Living Retrofit Decision Tool
        </div>
        <div class="text-md text-center">
          Before exploring our tool, please select from different types of
          building models to better cater your needs.
        </div>
      </div>
      <UCard>
        <template #header>
          <div class="stepper flex items-center justify-center">
            <div class="step1 flex flex-col items-center gap-1">
              <div class="icons activeIcon">
                <UIcon name="i-heroicons-home" class="w-5 h-5 text-slate-50" />
              </div>
              <div class="stepHeader">
                <div class="text-md font-semibold">Property</div>
              </div>
              <div class="stepSubheader">
                <div class="text-xs text-center">Select your building</div>
              </div>
            </div>
            <!-- <UDivider
              size="xs"
              :class="stepper >= 2 ? 'w-1/3 completedStep' : 'w-1/3'"
            />
            <div class="step1 flex flex-col items-center gap-1">
              <div :class="stepper >= 2 ? 'icons activeIcon' : 'icons'">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="text-slate-50 w-5 h-5"
                />
              </div>
              <div class="stepHeader">
                <div class="text-md font-semibold">Location</div>
              </div>
              <div class="stepSubheader">
                <div class="text-xs text-center">Select your location</div>
              </div>
            </div>
            <UDivider
              size="xs"
              :class="stepper == 3 ? 'w-1/3 completedStep' : 'w-1/3'"
            />
            <div class="step1 flex flex-col items-center gap-1">
              <div :class="stepper == 3 ? 'icons activeIcon' : 'icons'">
                <UIcon
                  name="i-heroicons-calculator"
                  class="text-slate-50 w-5 h-5"
                />
              </div>
              <div class="stepHeader">
                <div class="text-md font-semibold">Area</div>
              </div>
              <div class="stepSubheader text-center">
                <div class="text-xs text-center">Select your area</div>
              </div>
            </div> -->
          </div>
        </template>
        <div>
          <div class="step1Q">
            <div
              class="housingContainers flex flex-wrap gap-4 items-center md:justify-between justify-center columns-4"
            >
              <UCard
                :class="
                  housingSelected == 1 ? 'housing selectedHouse' : 'housing '
                "
                @click="houseSelect(1)"
              >
                <div class="container items-center gap-4 flex flex-col">
                  <div class="text-center">Sunnyside Gardens</div>
                  <img src="../public/Sunnyside_Gardens.jpeg" alt="" />
                </div>
              </UCard>
              <UCard
                :class="
                  housingSelected == 2 ? 'housing selectedHouse' : 'housing '
                "
                @click="houseSelect(2)"
              >
                <div class="container items-center gap-4 flex flex-col">
                  <div class="text-center">Westside Apartments</div>
                  <img src="../public/Westside_Apartments.jpeg" alt="" />
                </div>
              </UCard>
              <UCard
                :class="
                  housingSelected == 3 ? 'housing selectedHouse' : 'housing '
                "
                @click="houseSelect(3)"
              >
                <div class="container items-center gap-4 flex flex-col">
                  <div class="text-center">Parklane Gardens</div>
                  <img src="../public/Parklane_Gardens.jpeg" alt="" />
                </div>
              </UCard>
              <UCard
                :class="
                  housingSelected == 4 ? 'housing selectedHouse' : 'housing '
                "
                @click="houseSelect(4)"
              >
                <div class="container items-center gap-4 flex flex-col">
                  <div class="text-center">Amberwynd Apartments</div>
                  <img src="../public/Amberwynd_Apartments.jpeg" alt="" />
                </div>
              </UCard>
            </div>
          </div>

          <!-- <div class="step2Q flex items-center gap-6" v-if="stepper == 2">
            <UFormGroup label="Climate City" name="climateCity" class="w-1/4">
              <UInputMenu
                v-model="climateCity"
                size="md"
                variant="outline"
                color="primary"
                :options="locations"
              />
            </UFormGroup>
            <UFormGroup label="Climate Zone" name="climateZone" class="w-1/4">
              <UInput v-model="climateZone" variant="outline" disabled />
            </UFormGroup>
            <UFormGroup
              label="HDD (Heating Degree Days)"
              name="HDD"
              class="w-1/4"
            >
              <UInput v-model="HDD" variant="outline" disabled />
            </UFormGroup>
          </div>
          <div class="step3Q flex items-center gap-6" v-if="stepper == 3">
            <UFormGroup label="Gross Floor Area" name="grossFloorArea">
              <UInput v-model="area" type="number" />
            </UFormGroup>
            <UFormGroup label="Unit" name="unit" class="w-1/4">
              <UInputMenu
                v-model="areaUnit"
                size="md"
                color="primary"
                :options="units"
                class="w-1/3"
              />
            </UFormGroup>
          </div> -->
        </div>
        <template #footer>
          <div class="buttonsContainer flex justify-end items-center">
            <!-- <UButton
              label="Prev"
              color="primary"
              @click="handlePrev()"
              :disabled="stepper == 1"
            >
              <template #leading>
                <UIcon name="i-heroicons-arrow-left-20-solid" class="w-5 h-5" />
              </template>
            </UButton> -->
            <UButton
              :label="stepper != 1 ? 'Next' : 'Launch Pathfinder'"
              :disabled="handleDisable()"
              color="primary"
              @click="handleNext()"
            >
              <template #trailing>
                <UIcon
                  name="i-heroicons-arrow-right-20-solid"
                  class="w-5 h-5"
                />
              </template>
            </UButton>
          </div>
        </template>
      </UCard>
    </UContainer>
  </div>
</template>
<script>
definePageMeta({
  layout: "custom",
});
export default {
  data() {
    return {
      housingSelected: 0,
      isOpen: true,
      stepper: 1,

      climateZone: "7A",
      climateCity: "Calgary",
      area: 1200,
      areaUnit: "SF",
      HDD: null,

      units: ["SF", "MS"],
      locations: ["Calgary", "Edmonton"],
      // selected:false,
    };
  },
  mounted() {
    this.checkClimateCity();
  },
  watch: {
    climateCity() {
      this.climateCity == "Calgary"
        ? (this.HDD = 5000)
        : this.climateCity == "Edmonton"
        ? (this.HDD = 5120)
        : null;
    },
  },
  methods: {
    checkClimateCity() {
      this.climateCity == "Calgary"
        ? (this.HDD = 5000)
        : this.climateCity == "Edmonton"
        ? (this.HDD = 5120)
        : null;
    },
    houseSelect(number) {
      this.housingSelected = number;
      // this.selected=true;
    },
    handlePrev() {
      this.stepper != 1 ? this.stepper-- : null;
    },
    async handleNext() {
      this.stepper != 1
        ? this.stepper++
        : this.stepper == 1
        ? await navigateTo("/dashboard")
        : null;
    },
    handleDisable() {
      if (this.stepper == 1) {
        if (this.housingSelected == 0) {
          return true;
        } else return false;
      } else if (this.stepper == 2) {
        if (
          this.climateZone != null &&
          this.climateCity != null &&
          this.HDD != null
        ) {
          return false;
        } else return true;
      } else if (this.stepper == 3) {
        if (this.area && this.areaUnit != null) {
          return false;
        } else return true;
      }
    },
  },
};
</script>
<style scoped>
/* .backgroundCont {
  background-color: #fafafa;
} */
body {
  transition: color 0.3s, background-color 0.3s;
}
.housing {
  /* height: 100px; */
  cursor: pointer;
  transition: all ease-in-out 0.3s;
  /* width: 250px;
  height: 290px; */
  /* -webkit-transition-property: none; */
}

.housingContainers img {
  border-radius: 5%;
  height: 170px;
  width: 200px;
  object-fit: cover;
}

.housing:hover {
  /* box-shadow: 0 1px 30px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); */
  background-color: #1918190d;
}

/* .housing {
  box-shadow: none;
} */
.selectedHouse {
  /* border: 1px solid #00355c; */
  background-color: #a5caf4;
}
.selectedHouse:hover {
  /* border: 1px solid #00355c; */
  background-color: #a5caf4;
}
.icons {
  border-radius: 50%;
  background-color: #5153544f;
  padding: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step1 {
  position: relative;
  width: 200px;
}
.activeIcon {
  background-color: #002855;
}
/* .step1::after {
  content: "";
  border: 2px solid red;
  position: absolute;
  right: 0;
  width: 130%;
  align-self: center;
  height: 2px;
  top: 0;
  bottom: 0;
} */
</style>
<style>
.completedStep div {
  border-color: #00355c;
}
.step3Q .mt-1.relative {
  display: flex;
  align-items: center;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
