

All data will be dinamic from the backend.
Connection to backend is in the hooks folder.
if you dont find a data just create it, but ask me before you create it. 
Make the design simple and like formal documents.
Make reusable components for each section, if the data of the section are presnt in document you make it for document not bdt.
HEADER
Left: Logo of Danone
Center: Text — "REVUE QUOTIDIENNE DE CHANTIER ET / OU Bon de travil"
Right: "No BDT __/____it's going to be No_de_bdt/Annee and also the date of the day"


SECTION: Entreprises there are two sub sections here:
1) Section Entreprise Utilisatrice (Danone)
- Donneur d'ordre
- Fonction du donneur d'ordre
- Numéro de téléphone



2) Section Entreprise Sous-Traitante
- Raison sociale
- Adresse
- Numéro de téléphone
- Responsable chantier
- Fonction du responsable chantier
- Numéro de téléphone du responsable chantier


SECTION: titile will be "Revue quotidienne de chantier (Hygiène, Sécurité, Qualité et Environnement)"
This section is split into multiple blocks, we show the data in them as normal text:

- Descriptif des tâches autorisées ce jour ou restrictions  //this one is big muti-line text
- Lieu d’intervention  //one line
- Personnel Danone de la zone informé: // We show oui or non
- Effectif maximum sur le chantier: (here you put in the number of effectivfe max) personnes dont (Here you put the number of interimere) intérimaires
- les horaires de travail


SECTION: title will be "Risques résultants de la coactivité avec des entreprises extérieures"
Tableau à avec colonnes:
- Lieu
- Mode operatoire with two sub columns (Phase, Moyens Utilises)
- Risques prévisibles
- Mesures de prévention
- À prendre par (EE ou EU = Entreprise Extérieure / Utilisatrice)


SECTION: title will be "Risques particuliers de l’opération"
This is a two-column table that shows which specific risks are present for today’s operation.
we will have two columns for each column we has a text "Présence de risque",
The risks are them populated from the risks that are related to the current document
for each risque we will show:
logo - title;
if the risk is dangerus we show it in red red ball in front of it 
if it needs permit and the permit is not present in the document we show a small text "Permit absent" in red color
if the permit of a risk is in the document we show a small text "Permit present" in green color
- **Présence de risque**: 
  - Dangerous risk: 🔴
  - Permit absent: 🚫
  - Permit present: ✅

SECTION: title will be "Complément ou rappel de prévention"
This is a short block with Oui/Non.

Fields:
[nom du complément ou rappel de prévention] [Oui/Non]


SECTION: title will be "Compléments ou rappels liés à la Qualité et/ou Environnement"
This is a two-column with:
we but in it the audits related to the current document
column 1 will have the audit with type intervenant 
column 2 will have the audit with type outils


Last Section: title will be "Signatures"
we will split the section into two parts:
first part will have signatures of the entreprise utilisatrice (Danone)
second part will have signatures of the entreprise sous-traitante with the name of the donneur d'ordre