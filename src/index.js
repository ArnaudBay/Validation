import express from 'express';
import { z } from 'zod';

const app = express();

app.use(express.json());

const schemaUtilisateur = z.object({
    nom: z.string().min(2, 'Nom trop court (2 caractères min)'),
    email: z.email('Email invalide'),
    age: z.number().int().min(18, 'Vous devez avoir au moins 18 ans')
});

app.post('/utilisateurs', (req, res) => {

    try {
        const resultat = schemaUtilisateur.safeParse(req.body);

        if (!resultat.success) {
            return res.status(400).json({
                erreurs: resultat.error.issues
            });
        }

        const utilisateur = resultat.data;

        return res.status(201).json({
            message: 'Utilisateur créé',
            utilisateur
        });

    } catch (erreur) {
        console.error(erreur);

        return res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});