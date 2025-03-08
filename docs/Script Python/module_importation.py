import os
import datetime as dt
from math import *
from unittest import skip
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import datetime as dt # module pour avoir les date
from datetime import datetime
import chardet # permet de lire correctement un fichier



####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
## fonction : modificationType

def longueur(x):
    if type(x) == str:
        return(len(x))
    else:
        return(len(str(x)))
fonctionLongueurChaine = np.vectorize(longueur)

def chaine(x, y):
    if y == 0:
        return('')
    elif type(x) == str:
        if x[-1] == ' ':
            x = x[0:y-1]
            y = len(x)
        return('0'*(10-y) + x)
    else:
        return('0'*(10-y) + str(x))
fonctionChaine = np.vectorize(chaine)


def date(d, typeDate=1):
    if d == '' or d == 0 or d == '0':
        return('')
    if typeDate == 1:
        ryear = int(d[6:10])
        rmonth = int(d[3:5])
        rday = int(d[0:2])
        rhour = int(d[11:13])
        rminute = int(d[14:16])
        y = dt.datetime(year=ryear, month=rmonth, day=rday,
                        hour=rhour, minute=rminute)
        return(y)

    if typeDate == 2:
        try:
            ryear = int(d[6:10])
            rmonth = int(d[3:5])
            rday = int(d[0:2])
            y = dt.datetime(year=ryear, month=rmonth, day=rday)
        except ValueError:
            print(d)
        except TypeError:
            print(d)
        except IndexError :
            print(d)
        return(y)
fonctionDate = np.vectorize(date)


def flottant(nombre):
    if type(nombre) == str:
        nombre = nombre.replace(u'\xa0', '')  # '1\xa0452'
        nombre = nombre.replace(",", '.')
        nombre = nombre.replace(' ', '')
        try:
            y = float(nombre)
        except ValueError:
            y = eval(nombre)
    elif type(nombre) == int or type(nombre) == np.int64:
        y = float(nombre)
    elif type(nombre) == float or type(nombre) == np.float64:
        y = nombre
    else:
        print("Il y a un type dans la colonne qui est problématique")
        print(nombre)
        print(type(nombre))
    return(y)
fonctionFlottant = np.vectorize(flottant)


def zone(z):
    if type(z) != str:
        z = str(z)
    if len(z) == 3:
        return(z)
    elif len(z) == 2:
        return('C' + z)
    elif len(z) == 1:
        return('C0' + z)
    elif len(z) >= 4:
        return("C" + z[-2:])
fonctionZone = np.vectorize(zone)

def entier(x):
    if type(x) == float :
        return(int(x))
    if type(x) == int : 
        return(x)
    if type(x) == str :
        if x[0] == '0':
            x = x[1:]
        if x[0] == '0':
            x = x[1:]
        if x in ('', ' ', '  ', '   ', '    ', '     '):
            return(0)
        try :
            return(eval(x))
        except SyntaxError :
            raise ValueError (x, len(x))

fonctionEntier = np.vectorize(entier)

def string(x):
    return(str(x))

fonctionstring = np.vectorize(string)

def modificationType(dataframe : pd.DataFrame, colonne : str, typeColonne, typeDate=1) -> pd.DataFrame :
    """ Renvoie une copie du dataframe d'entrée, avec la colonne modifiée selon le type spécifié

    dataframe : pd.dataframe
    colonne : string du nom d'une colonne du dataframe
    type_col : type ou string, parmi les possibilités suivantes : float, dt.timedelta (à conjuguer avec typeDate), reference et zone
    typeDate : 1 ou 2. Si 1, renvoie de l'année à la seconde, si 2, renvoie de l'année au jour.
    """

    copie = dataframe.copy()
    copie = copie.replace("", 0)

    if typeColonne == float:
        copie[colonne] = fonctionFlottant(copie[colonne])
        copie = copie.astype({colonne: typeColonne})

    if typeColonne == dt.timedelta:
        copie[colonne] = fonctionDate(copie[colonne], typeDate=typeDate)

    if typeColonne == "reference" or typeColonne == "référence" or typeColonne == "Référence" :
        copie[colonne + 'bis'] = fonctionLongueurChaine(copie[colonne])
        copie[colonne] = fonctionChaine(copie[colonne], copie[colonne + 'bis'])
        copie = copie.drop([colonne + 'bis'], axis=1)
        copie = copie.astype({colonne: str})

    if typeColonne == 'Zone' or typeColonne == 'zone':
        copie[colonne] = fonctionZone(copie[colonne])
    
    if typeColonne == str :
        copie[colonne] = fonctionstring(copie[colonne])

    if typeColonne == int :
        copie[colonne] = fonctionEntier(copie[colonne])
        copie = copie.astype({colonne: typeColonne})

    return (copie)
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 










####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
## fonction d'importation du référentiel 

def importationReferentiel(chemin):
    """
    renvoie le dataframe du référentiel Puiseux total, avec les bons types de colonnes pour les colonnes suivantes :

    chemin : string, chemin vers l'emplacement du fichiers CSV
    """
    resultat = pd.read_csv(chemin,sep=';', keep_default_na=False, low_memory=False, thousands=' ', decimal=',')

    # Modification des types
    resultat = resultat.replace("", 0)

    for colonne in (["Qty_Max_casier_calculé", "QUANTITY_ESP4_WMS", "dim_pn_pack_vol_m3"]):
        resultat = modificationType(resultat, colonne, float)

    resultat = modificationType(resultat, 'id_pn_partnumber', "reference")
    resultat = modificationType(resultat, "PUTWY ZONE", "Zone")

    return(resultat)
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 












####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
# fonction d'importation de l'historique

def importationHistorique(chemin, referentiel, tempsSouhaiteJour=90, informationsClient=False):
    """
    renvoie le dataframe de l'historique, avec les bons types et le laps de temps
    
    chemin : string, chemin vers le fichier CSV de l'historique
    referentiel : dataframe, référentiel total
    tempsSouhaiteJour=90 : durée souhaitée de l'historique
    """
    # importation des l'historique ; les lignes de commandes vaguées.

    resultat = pd.read_csv(chemin, sep=';', low_memory=False, decimal=',')
    if informationsClient :
        resultat = resultat.reindex(["dt_ord", "DO", 'id_pn_partnumber', 'id_customer', 'Qté_Commande', 'QTY_BM', '1.0_match', 'PUTWY_ZONE', "Volume_m3", "dt_ord_affec", "dt_ord_recep"], axis=1)
        resultat = resultat.replace(np.nan, "")
        resultat = modificationType(resultat, "dt_ord_affec", dt.timedelta, typeDate=2)
        resultat = modificationType(resultat, "dt_ord_recep", dt.timedelta, typeDate=2)
        resultat = modificationType(resultat, 'id_customer', str)
    else :
        resultat = resultat.reindex(["dt_ord", "DO", 'id_pn_partnumber', 'Qté_Commande', 'QTY_BM', '1.0_match', 'PUTWY_ZONE', "Volume_m3"], axis=1)
        resultat = resultat.replace(np.nan, "")
    
    print("Avant tri, l'historique compte :", resultat.shape[0], " lignes de commande.")
    
    # Mettons les bons types
    resultat = modificationType(resultat, 'id_pn_partnumber', str)
    resultat = modificationType(resultat, 'Qté_Commande', float)
    resultat = modificationType(resultat, 'QTY_BM', float)
    resultat = modificationType(resultat, "Volume_m3", float)
    resultat = modificationType(resultat, 'PUTWY_ZONE', 'zone')
    resultat = modificationType(resultat, "dt_ord", dt.timedelta, typeDate=2)


    resultat = pd.merge(resultat, referentiel.reindex(['id_pn_partnumber', "dim_pn_pack_vol_m3", "type picking calculé", "Qty_Max_casier_calculé", \
            "QUANTITY_ESP4_WMS", "Categorie"], axis=1), left_on='id_pn_partnumber', right_on='id_pn_partnumber', how='left')

    resultat = resultat.dropna(subset=["type picking calculé"])

    derniereCommande = max(resultat["dt_ord"])
    semaine = dt.timedelta(days=tempsSouhaiteJour)

    resultat = resultat[resultat["dt_ord"] > derniereCommande - semaine]
    premiereCommande = min(resultat["dt_ord"])
    laps = (derniereCommande - premiereCommande).days + 1
    print("L'historique couvre désormais ", (laps), " jours de commande")

    return(resultat, laps)
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 










####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
####___________________________________________________________________________________________________ 
## fonction de séparation de l'emplacement

def f(car : str) -> str:
    """Renvoie l'annexe d'une commande, c'est à dire les deux derniers chiffre
    """
    return(car[-2:])

fonctionAnnexe = np.vectorize(f)



def custom_date_parser(date_str):
    # Implementez ici votre logique de conversion de chaîne en date
    if type(date_str) != str :
        date_str = clean_value_str(date_str)
    try :
        if date_str == nan :
            return(np.nan)
        date_obj = datetime.strptime(date_str, '%d/%m/%Y')
        return date_obj
    except ValueError :
        pass

def clean_value_float(value):
    if value == '':
        return 0
    if pd.isna(value):
        return 0
    return float(value.replace("\xa0", "").replace(",", "."))

def clean_value_str(value):
    if value == '':
        return ''
    if pd.isna(value):
        return ''
    return str(value)



types_colonnes = {

}

# Dictionnaire des fonctions de nettoyage par colonne
converters_referentielPuiseux = {
    'id_pn_partnumber' : clean_value_str,
    'label_pn_fr' : clean_value_str,
    'Categorie' : clean_value_str,
    'PUTWY ZONE' : clean_value_str, 
    'type picking calculé' : clean_value_str,
    'PLAT calculé' : clean_value_str,
    'Plus_Petit_Casier_Eligible' : clean_value_str,
    '2.0_match' : clean_value_str,
    '2.1_match' : clean_value_str,
    '3.0_match' : clean_value_str,
    '3.1_match' : clean_value_str,
    '3.2_match' : clean_value_str,
    '4.0_match' : clean_value_str,
    '4.1_match' : clean_value_str,
    '5.0_match' : clean_value_str,
    '5.1_match' : clean_value_str,
    '5.3_match' : clean_value_str,
    '5.4_match' : clean_value_str,
    '1.0_match' : clean_value_str,
    'LOCN_BRCD' : clean_value_str,
    'Type Casier' : clean_value_str,
    'PUISEUX' : clean_value_str,
    'flg_Mezz' : clean_value_str,
    'flg_picking_à_pied' : clean_value_str,
    'flg_faible_rotation' : clean_value_str,
    'GTIN_ESP3_WMS' : clean_value_str,
    'Avg_Nb_Ord_day' : clean_value_float,
    'Qty_Min_casier_calculé' : clean_value_float,
    'Qty_Max_casier_calculé' : clean_value_float,
    'dim_pn_pack_depth_mm' : clean_value_float, 
    'dim_pn_pack_length_mm' : clean_value_float,
    'dim_pn_pack_width_mm' : clean_value_float,
    'dim_pn_pack_vol_mm3' :clean_value_float,
    'dim_pn_pack_weight_gr' : clean_value_float,
    'Qté_Arfor' : clean_value_float,
    'S_Fréquence de vente' : clean_value_float,
    'U_Fréquence de vente' : clean_value_float,
    'T_Fréquence de vente' : clean_value_float,
    'S_Classe fréq de vente' : clean_value_float,
    'U_Classe fréq de vente' : clean_value_float,
    'T_Classe fréq de vente' : clean_value_float,
    '2.0' : clean_value_float,
    '2.1' : clean_value_float,
    '4.0' : clean_value_float,
    '4.1' : clean_value_float,
    '5.0' : clean_value_float,
    '5.1' : clean_value_float,
    '5.2' : clean_value_float,
    '5.3' : clean_value_float,
    '5.4' : clean_value_float,
    '1.0' : clean_value_float,
    'PUISEUX_STODISP' : clean_value_float,
    'qt_sup_l4_packaging' : clean_value_float,
    'qtesp4' : clean_value_float,
    'dim_pn_pack_vol_m3' : clean_value_float,
    'QUANTITY_ESP4_WMS' : clean_value_float,
    '1.0_Nb_Pièces_Utiles' : clean_value_float,
    '2.0_Nb_Pièces_Utiles' : clean_value_float,
    '2.1_Nb_Pièces_Utiles' : clean_value_float,
    '3.0_Nb_Pièces_Utiles' : clean_value_float,
    '4.0_Nb_Pièces_Utiles' : clean_value_float,
    '4.1_Nb_Pièces_Utiles' : clean_value_float,
    '4.2_Nb_Pièces_Utiles' : clean_value_float,
    '5.0_Nb_Pièces_Utiles' : clean_value_float,
    '5.1_Nb_Pièces_Utiles' : clean_value_float,
    '5.3_Nb_Pièces_Utiles' : clean_value_float,
    '5.4_Nb_Pièces_Utiles' : clean_value_float,
    '6.0_Nb_Pièces_Utiles' : clean_value_float,
    'id_sup_number' : clean_value_float,
    'QUANTITY_ESP3_WMS' : clean_value_float,
    'dt_pn_start_of_sales_real' : custom_date_parser,
    #'test' : str
}


def fonction_importation_globale(chemin, type='rapport', skiprows=0, sheet_name=None) :
    if chemin[-4:] == 'xlsx' :
        if sheet_name == None :
            resultat = pd.read_excel(chemin, engine='openpyxl', skiprows=skiprows)
        else : 
            resultat = pd.read_excel(chemin, engine='openpyxl', skiprows=skiprows, sheet_name=sheet_name)
    
    elif chemin[-3:] == 'csv':
        # détection du bon encodage
        with open(chemin, 'rb') as f:
            result = chardet.detect(f.read())
            encodage = result['encoding']
            #print(result)

        if type == 'referentiel' :# pour les rapports SPOT, il me semble que l'encodage est UTF-16
            resultat = pd.read_csv(chemin, encoding=encodage, sep=None, decimal=',', engine='python', converters=converters_referentielPuiseux)
        
        else :
            resultat = pd.read_csv(chemin, encoding=encodage, sep=None, decimal=',', engine='python')

    return (resultat)
    



