<script setup lang="ts">
// Défilement horizontal de panneaux (remplace bxSlider).
// Les panneaux sont les enfants directs marqués data-panneau ; le défilement s'appuie sur
// le « scroll-snap » du navigateur, donc il fonctionne aussi au doigt et au clavier.
// Pas de boucle : chaque flèche disparaît en bout de course.
import { onMounted, ref } from 'vue';

defineProps<{
  /** Images des flèches : sprites 31 × 62, état survolé en haut, état normal en bas. */
  flecheGauche: string;
  flecheDroite: string;
}>();

const piste = ref<HTMLElement | null>(null);
const index = ref(0);
const total = ref(0);

function suivreDefilement() {
  const element = piste.value;
  if (element) index.value = Math.round(element.scrollLeft / element.clientWidth);
}

// Après un défilement au doigt ou au clavier, l'index est recalé une fois le mouvement terminé.
let attente: ReturnType<typeof setTimeout> | undefined;
function surDefilement() {
  clearTimeout(attente);
  attente = setTimeout(suivreDefilement, 150);
}

function aller(delta: number) {
  const element = piste.value;
  if (!element) return;
  // L'index est mis à jour tout de suite : les flèches réagissent sans attendre la fin du défilement.
  index.value = Math.min(Math.max(index.value + delta, 0), total.value - 1);
  element.scrollTo({ left: index.value * element.clientWidth, behavior: 'smooth' });
}

onMounted(() => {
  total.value = piste.value?.querySelectorAll('[data-panneau]').length ?? 0;
  suivreDefilement();
});

const fleche =
  'absolute top-1/2 h-[31px] w-[31px] -translate-y-1/2 cursor-pointer bg-[position:0_-31px] bg-no-repeat hover:bg-[position:0_0] focus-visible:bg-[position:0_0]';
</script>

<template>
  <div class="relative">
    <div
      ref="piste"
      class="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
      @scroll.passive="surDefilement"
    >
      <slot />
    </div>
    <button
      v-show="index > 0"
      type="button"
      :class="[fleche, 'left-3 md:left-[45px]']"
      :style="{ backgroundImage: `url(${flecheGauche})` }"
      aria-label="Panneau précédent"
      @click="aller(-1)"
    />
    <button
      v-show="index < total - 1"
      type="button"
      :class="[fleche, 'right-3 md:right-[45px]']"
      :style="{ backgroundImage: `url(${flecheDroite})` }"
      aria-label="Panneau suivant"
      @click="aller(1)"
    />
  </div>
</template>
