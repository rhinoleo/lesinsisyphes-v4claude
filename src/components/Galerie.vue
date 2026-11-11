<script setup lang="ts">
// Galerie photo : bande de vignettes paginée, grande photo en fondu enchaîné, légende.
// Remplace les plugins jQuery Galleriffic, history et opacityrollover.
// Navigation : clic sur une vignette, clic sur la photo (suivante), flèches du clavier,
// et une adresse par photo (#3) pour que le bouton « retour » du navigateur fonctionne.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export interface Photo {
  src: string;
  largeur: number;
  hauteur: number;
  vignette: string;
  tailleVignette: number;
  titre?: string;
  description?: string;
}

const props = defineProps<{ photos: Photo[] }>();

const VIGNETTES_PAR_PAGE = 8;
/** Sur grand écran, le bas des photos basses s'aligne à cette distance du haut de la zone. */
const LIGNE_DE_BASE = 352;

const index = ref(0);
const page = ref(0);

const photo = computed(() => props.photos[index.value]!);
const nombreDePages = computed(() => Math.ceil(props.photos.length / VIGNETTES_PAR_PAGE));
const vignettesVisibles = computed(() => {
  const debut = page.value * VIGNETTES_PAR_PAGE;
  return props.photos
    .slice(debut, debut + VIGNETTES_PAR_PAGE)
    .map((p, i) => ({ photo: p, index: debut + i }));
});

function decalageHaut(p: Photo): string {
  return `${Math.max(0, LIGNE_DE_BASE - p.hauteur)}px`;
}

function indexDepuisAdresse(): number {
  const numero = Number.parseInt(window.location.hash.slice(1), 10);
  return Number.isInteger(numero) && numero >= 1 && numero <= props.photos.length ? numero - 1 : 0;
}

/** Affiche une photo ; l'adresse est mise à jour pour alimenter l'historique du navigateur. */
function aller(nouvelIndex: number) {
  const total = props.photos.length;
  index.value = ((nouvelIndex % total) + total) % total;
  window.location.hash = String(index.value + 1);
}

function surChangementAdresse() {
  index.value = indexDepuisAdresse();
}

function surTouche(evenement: KeyboardEvent) {
  if (evenement.altKey || evenement.ctrlKey || evenement.metaKey) return;
  if (evenement.key === 'ArrowRight') aller(index.value + 1);
  else if (evenement.key === 'ArrowLeft') aller(index.value - 1);
}

// La bande de vignettes suit la photo affichée ; la photo suivante est préchargée.
watch(
  index,
  (i) => {
    page.value = Math.floor(i / VIGNETTES_PAR_PAGE);
    if (typeof window !== 'undefined') {
      const suivante = props.photos[(i + 1) % props.photos.length];
      if (suivante) new Image().src = suivante.src;
    }
  },
  { immediate: true },
);

onMounted(() => {
  index.value = indexDepuisAdresse();
  window.addEventListener('hashchange', surChangementAdresse);
  window.addEventListener('keydown', surTouche);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', surChangementAdresse);
  window.removeEventListener('keydown', surTouche);
});

const fleche =
  'm-[2px] flex w-[22px] cursor-pointer items-center justify-center text-white opacity-[0.67] transition-opacity hover:opacity-100 focus-visible:opacity-100';
</script>

<template>
  <div>
    <!-- Bande de vignettes : les flèches prennent la hauteur des vignettes pour rester centrées
         dessus ; la hauteur minimale conserve l'espace d'origine avant la photo. -->
    <div class="flex min-h-[81px] items-start justify-center md:justify-start md:pl-[127px]">
      <div class="flex max-w-full">
        <button
          type="button"
          :class="[fleche, { invisible: page === 0 }]"
          title="Page précédente"
          aria-label="Vignettes précédentes"
          @click="page--"
        >
          <svg viewBox="0 0 22 18" width="22" height="18" aria-hidden="true">
            <path d="M22 9H2M9 2 2 9l7 7" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
        <ul class="flex w-[448px] max-w-full flex-wrap">
          <li v-for="vignette in vignettesVisibles" :key="vignette.index" class="m-[2px]">
            <button
              type="button"
              class="block cursor-pointer p-px transition-opacity hover:opacity-100 focus-visible:opacity-100"
              :class="vignette.index === index ? 'bg-white opacity-100' : 'opacity-[0.67]'"
              :aria-label="`Photo ${vignette.index + 1}`"
              :aria-current="vignette.index === index"
              @click="aller(vignette.index)"
            >
              <img
                :src="vignette.photo.vignette"
                :width="vignette.photo.tailleVignette"
                :height="vignette.photo.tailleVignette"
                alt=""
                class="block"
              />
            </button>
          </li>
        </ul>
        <button
          type="button"
          :class="[fleche, { invisible: page >= nombreDePages - 1 }]"
          title="Page suivante"
          aria-label="Vignettes suivantes"
          @click="page++"
        >
          <svg viewBox="0 0 22 18" width="22" height="18" aria-hidden="true">
            <path d="M0 9h20M13 2l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Grande photo et légende -->
    <div class="relative md:h-[960px]">
      <div class="grid md:w-[750px]">
        <Transition
          enter-active-class="transition-opacity duration-[900ms]"
          leave-active-class="transition-opacity duration-[900ms]"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <button
            :key="index"
            type="button"
            class="col-start-1 row-start-1 cursor-pointer self-start justify-self-center md:mt-(--haut)"
            :style="{ '--haut': decalageHaut(photo) }"
            aria-label="Photo suivante"
            @click="aller(index + 1)"
          >
            <img
              :src="photo.src"
              :width="photo.largeur"
              :height="photo.hauteur"
              :alt="photo.titre ?? `Photo ${index + 1} sur ${photos.length}`"
              class="block h-auto max-w-full border border-[#333]"
            />
          </button>
        </Transition>
      </div>

      <div
        class="pointer-events-none pt-5 text-[#eee] md:absolute md:top-[260px] md:right-0 md:h-[700px] md:w-[334px] md:pt-0"
      >
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-[450ms]"
          leave-active-class="transition-opacity duration-[450ms]"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div :key="index" class="px-3 md:pt-[500px]">
            <div
              v-if="photo.titre"
              class="font-titre text-[1.6em] leading-[0.9] tracking-[0.1em] whitespace-pre-line text-[#ccc]"
            >
              {{ photo.titre }}
            </div>
            <div
              v-if="photo.description"
              class="pt-[30px] leading-[1.17] whitespace-pre-line text-[#ccc]"
            >
              {{ photo.description }}
            </div>
          </div>
        </Transition>
        <div class="px-3 pt-5 text-[#888] md:absolute md:bottom-0 md:left-0 md:pt-0">
          Photo {{ index + 1 }} sur {{ photos.length }}
        </div>
      </div>
    </div>
  </div>
</template>
