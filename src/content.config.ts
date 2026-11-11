// Collections de contenu : un fichier YAML par projet dans src/content/projets/.
// Ajouter un projet = ajouter un fichier ; il apparaît sur l'accueil et dans sa liste.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projets = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projets' }),
  schema: ({ image }) =>
    z.object({
      /** Titre court, affiché sur la mosaïque d'accueil et dans les listes. */
      titre: z.string(),
      /** Titre plus long pour les listes, si différent du titre court. */
      titreListe: z.string().optional(),
      annee: z.number().int(),
      /** « realisation » : projet réalisé ; « proposition » : projet non réalisé. */
      categorie: z.enum(['realisation', 'proposition']),
      /** Ligne de contexte sous le titre : événement | lieu | année. */
      contexte: z.string(),
      /** Résumé affiché dans les listes ; les retours à la ligne sont conservés. */
      resume: z.string(),
      /** Rang d'affichage : le plus petit en premier (du plus récent au plus ancien). */
      ordre: z.number(),
      /** Vignette de la mosaïque d'accueil (260 × 195). */
      vignetteAccueil: image(),
      /** Vignette des listes Réalisations / Propositions (325 × 130). */
      vignetteListe: image(),
    }),
});

// Galeries photo : un fichier YAML par galerie dans src/content/galeries/.
// Le nom du fichier donne l'adresse de la page (expo01.yaml → /expo01/).
const galeries = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/galeries' }),
  schema: ({ image }) =>
    z.object({
      /** Titre de l'onglet du navigateur. */
      titre: z.string(),
      /** Intitulé affiché en haut de la galerie. */
      intitule: z.string(),
      /** Fil d'Ariane optionnel affiché avant l'intitulé. */
      fil: z.array(z.object({ titre: z.string(), href: z.string() })).default([]),
      /** Adresse du lien « < retour ». */
      retour: z.string(),
      /** Image de fond, calée en bas du cadre. */
      fond: image(),
      photos: z.array(
        z.object({
          image: image(),
          /** Vignette recadrée à la main (50 × 50) ; à défaut, recadrage automatique au centre. */
          vignette: image().optional(),
          /** Légende : titre et texte, tous deux optionnels (retours à la ligne conservés). */
          titre: z.string().optional(),
          description: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { projets, galeries };
