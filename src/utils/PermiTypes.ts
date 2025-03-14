/*public enum PermiTypes {
    FOUILLE, //Permis de travail spécifique en fouille
    ATEX, //Permis d’intervention en zone ATEX
    ESPACE_CONFINE, //Permis de travail en espace confiné/restrient
    LEVAGE, //Permis de travail spécifique de levage
    HAUTEUR, //Permis de travail spécifique en hauteur
    TOITURE; //Permis de travail spécifique en toiture
}
*/

enum PermiTypes {
    NONE = "NONE",
    FOUILLE = "FOUILLE", //Permis de travail spécifique en fouille
    ATEX = "ATEX", //Permis d’intervention en zone ATEX
    ESPACE_CONFINE = "ESPACE_CONFINE", //Permis de travail en espace confiné/restrient
    LEVAGE = "LEVAGE", //Permis de travail spécifique de levage
    HAUTEUR = "HAUTEUR", //Permis de travail spécifique en hauteur
    TOITURE = "TOITURE" //Permis de travail spécifique en toiture
}

export default PermiTypes;