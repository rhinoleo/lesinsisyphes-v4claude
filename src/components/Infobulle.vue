<script setup lang="ts">
// Infobulle riche affichée sous un mot du texte (remplace le plugin jQuery tipTip).
// S'ouvre au survol, au focus clavier ou au toucher ; se ferme avec Échap.
import { nextTick, onBeforeUnmount, ref, useId } from 'vue';

const DELAI_OUVERTURE = 400;
const MARGE_ECRAN = 5;

const id = useId();
const ouverte = ref(false);
const decalage = ref(0);
const bulle = ref<HTMLElement | null>(null);
let minuterie: ReturnType<typeof setTimeout> | undefined;

async function afficher() {
  ouverte.value = true;
  decalage.value = 0;
  await nextTick();
  // Garde la bulle dans la fenêtre lorsqu'elle déborde à gauche ou à droite.
  const cadre = bulle.value?.getBoundingClientRect();
  if (!cadre) return;
  const largeur = document.documentElement.clientWidth;
  if (cadre.left < MARGE_ECRAN) decalage.value = MARGE_ECRAN - cadre.left;
  else if (cadre.right > largeur - MARGE_ECRAN) decalage.value = largeur - MARGE_ECRAN - cadre.right;
}

function ouvrir(immediat = false) {
  clearTimeout(minuterie);
  if (immediat) void afficher();
  else minuterie = setTimeout(afficher, DELAI_OUVERTURE);
}

function fermer() {
  clearTimeout(minuterie);
  ouverte.value = false;
}

function basculer() {
  if (ouverte.value) fermer();
  else ouvrir(true);
}

onBeforeUnmount(() => clearTimeout(minuterie));
</script>

<template>
  <span class="relative" @mouseenter="ouvrir()" @mouseleave="fermer" @keydown.esc="fermer">
    <button
      type="button"
      class="bg-fluo cursor-pointer text-black"
      :aria-describedby="id"
      :aria-expanded="ouverte"
      @focus="ouvrir(true)"
      @blur="fermer"
      @click="basculer"
    >
      <slot />
    </button>
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <span v-show="ouverte" class="absolute top-full left-1/2 z-50 block pt-[5px]">
        <span
          class="absolute top-[-7px] left-[-6px] block border-[6px] border-transparent border-b-[rgb(45_45_45/0.88)]"
          aria-hidden="true"
        />
        <span
          :id="id"
          ref="bulle"
          role="tooltip"
          class="block w-max max-w-[200px] rounded-[3px] border border-white/25 bg-[rgb(45_45_45/0.88)] px-2 pt-1 pb-[5px] text-left text-[11px] leading-none font-normal text-white shadow-[0_0_3px_#555] [text-shadow:0_0_2px_#000]"
          :style="{ transform: `translateX(calc(-50% + ${decalage}px))` }"
        >
          <slot name="contenu" />
        </span>
      </span>
    </Transition>
  </span>
</template>
