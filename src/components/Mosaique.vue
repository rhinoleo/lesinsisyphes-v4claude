<script setup lang="ts">
// Mosaïque de l'accueil : au survol, un voile avec le titre glisse depuis le bord
// par lequel la souris est entrée, et repart par celui où elle sort
// (remplace le plugin jQuery hoverdir).

export interface Vignette {
  href: string;
  titre: string;
  annee: number;
  src: string;
  largeur: number;
  hauteur: number;
}

defineProps<{ vignettes: Vignette[] }>();

// Position de départ du voile selon le bord : haut, droite, bas, gauche.
const HORS_CADRE = [
  { left: '0', top: '-100%' },
  { left: '100%', top: '0' },
  { left: '0', top: '100%' },
  { left: '-100%', top: '0' },
] as const;

/** Bord le plus proche du pointeur : 0 haut, 1 droite, 2 bas, 3 gauche. */
function bordLePlusProche(cadre: DOMRect, evenement: MouseEvent): number {
  const { width: l, height: h } = cadre;
  const x = (evenement.clientX - cadre.left - l / 2) * (l > h ? h / l : 1);
  const y = (evenement.clientY - cadre.top - h / 2) * (h > l ? l / h : 1);
  return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
}

function voileDe(lien: HTMLElement): HTMLElement {
  return lien.querySelector<HTMLElement>('[data-voile]')!;
}

function placer(voile: HTMLElement, position: { left: string; top: string }) {
  voile.style.left = position.left;
  voile.style.top = position.top;
}

function entrer(evenement: MouseEvent | FocusEvent) {
  const lien = evenement.currentTarget as HTMLElement;
  const voile = voileDe(lien);
  const bord =
    evenement instanceof MouseEvent ? bordLePlusProche(lien.getBoundingClientRect(), evenement) : 0;
  // Place le voile hors cadre sans animation, puis le fait glisser en place.
  voile.style.transition = 'none';
  placer(voile, HORS_CADRE[bord]);
  void voile.offsetWidth;
  voile.style.transition = '';
  placer(voile, { left: '0', top: '0' });
}

function sortir(evenement: MouseEvent | FocusEvent) {
  const lien = evenement.currentTarget as HTMLElement;
  const bord =
    evenement instanceof MouseEvent ? bordLePlusProche(lien.getBoundingClientRect(), evenement) : 0;
  placer(voileDe(lien), HORS_CADRE[bord]);
}
</script>

<template>
  <ul class="grid grid-cols-2 gap-[5px] px-[5px] sm:grid-cols-3">
    <li v-for="vignette in vignettes" :key="vignette.href" class="bg-white">
      <a
        :href="vignette.href"
        class="relative block overflow-hidden hover:no-underline"
        @mouseenter="entrer"
        @mouseleave="sortir"
        @focus="entrer"
        @blur="sortir"
      >
        <img
          :src="vignette.src"
          :width="vignette.largeur"
          :height="vignette.hauteur"
          alt=""
          class="block h-auto w-full"
        />
        <span
          data-voile
          class="absolute top-[-100%] left-0 block h-full w-full bg-[rgb(75_75_75/0.7)] transition-all duration-300 ease-[ease]"
        >
          <span
            class="mx-5 mt-10 mb-5 block border-b border-white/50 py-[10px] leading-[1.2] text-white/90 uppercase [text-shadow:1px_1px_1px_rgb(0_0_0/0.2)]"
          >
            {{ vignette.titre }}<br />{{ vignette.annee }}
          </span>
        </span>
      </a>
    </li>
  </ul>
</template>
