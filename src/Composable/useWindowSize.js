import { ref, onMounted, onUnmounted, computed } from 'vue';

export function useWindowSize() {
  const windowWidth = ref(window.innerWidth);

  const updateWidth = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => window.addEventListener("resize", updateWidth));
  onUnmounted(() => window.removeEventListener("resize", updateWidth));

  // خاصية التحقق من الجوال (حسب المعيار الذي حددتِيه 1024px)
  const isMobile = computed(() => windowWidth.value < 780);

  // إرجاع القيم لاستخدامها في المكونات
  return { windowWidth, isMobile };
}