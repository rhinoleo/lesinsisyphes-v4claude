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

export const collections = { projets };
