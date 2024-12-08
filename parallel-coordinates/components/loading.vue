<template>
  <div class="loading">
    <svg class="Container" viewBox="0 0 40 40" height="40" width="40">
      <circle
        class="track"
        cx="20"
        cy="20"
        r="57.5"
        pathlength="10"
        stroke-width="5px"
        fill="none"
      />
      <circle
        class="car"
        cx="20"
        cy="20"
        r="57.5"
        pathlength="10"
        stroke-width="5px"
        fill="none"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "loading",
};
</script>

<style>
.loading {
  width: 100%;
  height: 100vh;
  z-index: 9999999;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media only screen and (max-width: 1600px) {
  .loadingImage {
    width: 150px;
    height: 150px;
  }
}
@media only screen and (min-width: 1601px) {
  .loadingImage {
    width: 150px;
    height: 150px;
  }
}
</style>

<style>
.Container {
  --uib-size: 40px;
  --uib-color: #00355c;

  --uib-speed: 1s;
  --uib-bg-opacity: 0.1;
  height: var(--uib-size);
  width: var(--uib-size);
  transform-origin: center;
  animation: rotateLoader var(--uib-speed) linear infinite;
  will-change: transform;
  overflow: visible;
}

.car {
  fill: none;
  stroke: var(--uib-color);
  stroke-dasharray: 82;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  transition: stroke 0.5s ease;
}

.track {
  fill: none;
  stroke: var(--uib-color);
  opacity: var(--uib-bg-opacity);
  transition: stroke 0.5s ease;
}

@keyframes rotateLoader {
  100% {
    transform: rotate(360deg);
  }
}
</style>
