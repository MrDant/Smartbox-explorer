<template>
  <div class="carousel">
    <div class="prev slider" :class="sliderClass" @click="slide(index - 1)">
      <i class="fas fa-arrow-circle-left"></i>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="next slider" :class="sliderClass" @click="slide(index + 1)">
      <i class="fas fa-arrow-circle-right"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "Carousel",
  props: ["sliderClass"],
  data: () => {
    return {
      slides: [],
      index: 0,
    };
  },
  methods: {
    slide(id) {
      if (id < 0) {
        id = this.slides.length - 1;
      }
      if (id > this.slides.length - 1) {
        id = 0;
      }
      this.index = id;
      this.slides.forEach((slide, index) => {
        if (index == this.index) {
          slide.style.display = "block";
        } else {
          slide.style.display = "none";
        }
      });
    },
  },
  mounted() {
    this.slides = this.$el.querySelectorAll(".slide");
    this.slide(0);
  },
};
</script>
<style scoped>
.carousel {
  display: flex;
  align-items: center;
}

.content {
  flex-grow: 1;
}
.slider {
  margin: 2rem;
  font-size: 2rem;
}

.slider:hover {
  cursor: pointer;
}
</style>
