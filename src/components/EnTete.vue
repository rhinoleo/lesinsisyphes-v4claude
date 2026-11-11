<script setup lang="ts">
// En-tête du site : panneau « à propos », menu principal et bandeau « contact ».
// Les deux panneaux s'ouvrent et se ferment depuis le menu, comme sur le site d'origine.
import { onMounted, ref } from 'vue';
import Infobulle from './Infobulle.vue';

const aproposOuvert = ref(false);
const contactOuvert = ref(false);

// L'adresse est assemblée côté navigateur pour ne pas figurer en clair dans le HTML (anti-spam).
const courriel = ref('');
onMounted(() => {
  courriel.value = ['contact', ['lesinsisyphes', 'fr'].join('.')].join('@');
});

const lienMenu =
  'inline-block bg-black px-[6px] pt-px text-[0.72rem] leading-[13px] text-white uppercase hover:text-fluo hover:no-underline cursor-pointer';
</script>

<template>
  <header class="relative">
    <div
      v-show="aproposOuvert"
      id="apropos"
      class="px-3 pb-2 text-[0.85em] md:h-[116px] md:pr-[13px] md:pb-0 md:pl-[325px]"
    >
      <p class="pt-[13px]">
        Fondée par
        <Infobulle>
          Caroline Alvarez
          <template #contenu>
            Pour Caroline Alvarez la ville est une exposition d’art abstrait ; tout y est pictural
            et elle s’applique avec son appareil photo à en relever les meilleurs extraits.
            Parallèlement, en faisant abstraction de la fonction des choses, elle perçoit leur
            inutilité essentielle et la ville lui apparaît alors comme une biosphère sauvage et
            autonome, libre de tout engagement civil, un terrain d’expression idéal.
          </template>
        </Infobulle>
        et
        <Infobulle>
          Renaud Denier
          <template #contenu>
            Renaud Denier s’intéresse à la ville comme superposition d’une expérience concrète et
            d’une représentation mentale. Les villes traversées, rêvées, issues du cinéma ou de la
            littérature alimentent les projections sur la ville flânée ou explorée dans une pratique
            de la dérive.
          </template> </Infobulle
        >, tous deux designers d'espace, l'association Les Insisyphes prépare, l'espace de quelques
        jours, des rencontres improbables entre des oeuvres à l'érosion assumée et des
        <Infobulle>
          lieux
          <template #contenu>
            <strong class="mb-[21px] block">Les Expos en cours</strong>
            Durant un week-end ou quelques jours, la cour d'un immeuble d'habitation (voire sa cave,
            sa cage d'escalier ou une traboule lorsqu'elles s'y prêtent) accueille des oeuvres
            d'arts plastiques. Le lieu est mis en scène. Un vernissage est organisé : pendant ces
            quelques heures, la cour se transforme en espace semi-public. En échange de leur accueil
            et de leur bienveillance, les résidents de l'immeuble (des immeubles) profitent pendant
            deux ou trois jours de ce singulier musée éphémère à ciel ouvert.
          </template>
        </Infobulle>
        impropres à la consommation... de l'art !<br />
        Au-delà de sa vocation d'origine, l'association produit également des interventions
        artistiques dans l'espace public.
      </p>
      <p>
        Les Insisyphes se sont rencontrés pendant leur formation en design d’espaces à l’école des
        Beaux-arts de Lyon. Ils partagent un certain rapport à la ville, à la fois poétique et
        absurde qui les conduit à s’associer pour proposer des expériences artistiques dans l’espace
        urbain. Les Insisyphes jouent avec des éléments de la ville insignifiants ou très connotés
        qu’ils détournent ou s’approprient, souvent avec humour, pour créer de manière subtile ou
        flagrante des situations étonnantes. Ils se plaisent à déjouer les perceptions et les usages
        pour dévoiler l’insolite d’un univers pourtant connu.
      </p>
    </div>

    <nav class="relative z-20 mt-2 md:mt-[93px] md:pr-[33px]" aria-label="Menu principal">
      <ul class="flex flex-wrap justify-end gap-x-[13.5px] gap-y-1">
        <li class="leading-none">
          <button
            type="button"
            :class="lienMenu"
            title="l'association Les Insisyphes"
            aria-controls="apropos"
            :aria-expanded="aproposOuvert"
            @click="aproposOuvert = !aproposOuvert"
          >
            à propos
          </button>
        </li>
        <li class="leading-none">
          <a href="/" :class="lienMenu" title="nouvelles fraîches">actualité</a>
        </li>
        <li class="leading-none">
          <a href="/realisations/" :class="lienMenu" title="réalisations">réalisations</a>
        </li>
        <li class="leading-none">
          <a href="/propositions/" :class="lienMenu" title="propositions">propositions</a>
        </li>
        <li class="leading-none">
          <button
            type="button"
            :class="lienMenu"
            title="nous contacter"
            aria-controls="contact"
            :aria-expanded="contactOuvert"
            @click="contactOuvert = !contactOuvert"
          >
            contact
          </button>
        </li>
        <li class="leading-none">
          <a
            href="https://www.facebook.com/pages/Les-Insisyphes/149184435127936"
            target="_blank"
            rel="noopener"
            :class="lienMenu"
            title="les Ins' sur Facebook"
            >facebook</a
          >
        </li>
      </ul>

      <address
        v-show="contactOuvert"
        id="contact"
        class="absolute top-full right-0 mt-[11px] max-w-full border-r border-[#999] bg-black px-[6px] pt-px pb-[3px] leading-[14px] text-[#999] not-italic md:right-[11px]"
      >
        <a v-if="courriel" :href="`mailto:${courriel}`" :title="courriel" class="text-white"
          >e-mail</a
        >
        | Association Les Insisyphes - 12 rue Grognard - 69001 Lyon
      </address>
    </nav>
  </header>
</template>
