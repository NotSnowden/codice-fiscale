const vnome = document.getElementById("nome")
const vcognome = document.getElementById("cognome")
const vgiorno = document.getElementById("giorno")
const vmese = document.getElementById("mese")
const vanno = document.getElementById("anno")
const vcodice = document.getElementById("codice-comune")
const vmaschio = document.getElementById("m")
const vfemmina = document.getElementById("f")
const btn = document.getElementById("calcola")
const result = document.querySelector(".result")
const SIZE = 26

btn.onclick = () => {
    if (!isInputValid()) {
        alert("Controllare di aver inserito i dati correttamente")
        reset()
        return
    }

    let sesso = (vmaschio.checked) ? 'm' : 'f'

    let codice_fiscale = main(vnome.value.replace(/ /g,''), vcognome.value.replace(/ /g,''), parseInt(vgiorno.value), vmese.value, vanno.value, sesso, vcodice.value.replace(/ /g,''))
    
    result.innerHTML = "Il tuo codice fiscale è: <strong>" + codice_fiscale + "</strong>"
}

function main(nome, cognome, giorno, mese, anno, sesso, codice_comune) {
    let codice_fiscale = ""

    nome = nome.toUpperCase()
    cognome = cognome.toUpperCase()
    codice_comune = codice_comune.toUpperCase()

    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let codMesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T']
    let num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let codPari = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
    let codDispari = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23]
    let sommaCheck = 0, checkDigit
    
    nome = plusExceptions(nome)
    cognome = plusExceptions(cognome)

    if (nome.length > 3)
      nome = setCharAt(nome, 1, '')

    nome = nome.substring(0, 3)
    cognome = cognome.substring(0, 3)

    anno = anno.toString()
    anno = anno.substring(2, 4)

    let tmp = ""

    for(let i = 0; i < mese; i++)
        tmp = codMesi[i]

    mese = tmp

    codice_fiscale = cognome + nome + anno + mese

    if (sesso == 'm') {
        if (giorno < 10)
            giorno = "0" + giorno.toString()
        
        codice_fiscale += giorno
    }
    else
        codice_fiscale += "" + (giorno + 40)

    codice_fiscale += codice_comune

    //il primo for cambia ad ogni iterazione il carattere da analizzare.
    //il trattamento tra posizione dispari e pari è invertito perchè il controllo inizia da 0 invece che da 1
    for(let i = 0; i < codice_fiscale.length; i++) {
        if (i % 2 == 0) {
            for(let j = 0; j < SIZE; j++)
                sommaCheck += (codice_fiscale.charAt(i) == letters[j]) ? codDispari[j] : 0;
    
            for(let j = 0; j < 10; j++)
                sommaCheck += (codice_fiscale.charAt(i) == num[j]) ? codDispari[j] : 0;
        }
        else {
            for(let j = 0; j < SIZE; j++)
                sommaCheck += (codice_fiscale.charAt(i) == letters[j]) ? codPari[j] : 0;
    
            for(let j = 0; j < 10; j++)
                sommaCheck += (codice_fiscale.charAt(i) == num[j]) ? codPari[j] : 0;
        }
    }

    //una volta terminato, la somma viene divisa per 26, e la variabile checkDigit prende il resto
    //della divisione convertito in char. questo sarà il mio check digit.
    checkDigit = sommaCheck % 26;
    checkDigit = String.fromCharCode(65 + checkDigit)
    codice_fiscale += checkDigit;

    return codice_fiscale
}

function plusExceptions(tmp) {
    let vowels = "AEIOU", consonants = "BCDFGHJKLMNPQRSTVWXYZ", app;
    let cons = 0;
    let flag = true;

    //per coprire l'eccezione dei nomi con tre lettere copio tmp nell'appogio app, rimuovo le vocali da tmp,
    //poi con il procedimento inverso a prima rimuovo le consonanti da app. infine unisco le due stringhe risultanti.
    //per coprire l'eccezione del nome con solo due consonanti, dopo averle contante per verificare che siano due,
    //copio tmp nell'appoggio app e se trovo una vocale in app la aggiungo a tmp. per evitare che ne aggiunga altre,
    //imposto la flag a false per interrompere il for.
    //se il nome ha due lettere, si aggiunge una X alla fine.
    for(let i = 0; i < tmp.length; i++) {
        for(let j = 0; j < consonants.length; j++)
            cons += (tmp.charAt(i) == consonants.charAt(j)) ? 1 : 0;
    }

    if (cons == 2) {
        app = tmp;
        tmp = tmp.replace(/[AEIOU]/g,'')
        for(let i = 0; i < app.length && flag; i++) {
            for(let j = 0; j < vowels.length; j++) {
                if (app.charAt(i) == vowels.charAt(j)) {
                    tmp += vowels.charAt(j);
                    flag = false;
                }
            }
        }
    }
    if (tmp.length == 3) {
        app = tmp;
        tmp = tmp.replace(/[AEIOU]/g,'')

        app = app.replace(/[BCDFGHJKLMNPQRSTVWXYZ]/g,'')

        tmp += app;
    }
    else if (tmp.length == 2 && flag)
        tmp += 'X';
    else
        tmp = tmp.replace(/[AEIOU]/g,'')

    return tmp;
}

function isInputValid() {
    if (vnome.value.trim() == "" || vcognome.value.trim() == "" || vgiorno.value.trim() == "" || vmese.value.trim() == "" || vanno.value.trim() == "" || vcodice.value.trim() == "")
        return false

    if (!vmaschio.checked && !vfemmina.checked)
        return false
    
    return true
}

function reset() {
    vnome.value = ""
    vcognome.value = ""
    vgiorno.value = ""
    vmese.value = ""
    vanno.value = ""
    vmaschio.checked = false
    vfemmina.checked = false
    vcodice.value = ""
}

vgiorno.onchange = () => {
    if (vgiorno.value < 1)
        vgiorno.value = 1

    if (vgiorno.value > 31)
        vgiorno.value = 31
}

vmese.onchange = () => {
    if (vmese.value < 1)
        vmese.value = 1

    if (vmese.value > 12)
        vmese.value = 12
}

vanno.onchange = () => {
    if (vanno.value < 1900)
        vanno.value = 1900

    if (vanno.value > 2022)
        vanno.value = 2022
}

vmaschio.onclick = () => {
    if (vfemmina.checked)
        vfemmina.checked = false
}

vfemmina.onclick = () => {
    if (vmaschio.checked)
        vmaschio.checked = false
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}