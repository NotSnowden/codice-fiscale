const codice = document.getElementById("codice-fiscale")
const nome = document.getElementById("nome")
const cognome = document.getElementById("cognome")
const nascita = document.getElementById("data")
const comune = document.getElementById("comune")
const calcola = document.getElementById("calcola")

calcola.onclick = () => {
    let codice_fiscale = codice.value.toUpperCase()

    if (!isInputValid(codice_fiscale)) {
        alert("Il codice fiscale inserito non è valido, riprovare.")
        return
    }

    nome.innerHTML = "<strong>Nome:</strong> " + codice_fiscale.substring(3, 6)
    cognome.innerHTML = "<strong>Cognome:</strong> " + codice_fiscale.substring(0, 3)

    let day = codice_fiscale.substring(9, 11)
    
    if (parseInt(day) > 31)
        day = parseInt(day) - 40

    let month = codice_fiscale.substring(8, 9)
    let codMesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T']

    month = codMesi.indexOf(month) + 1

    if (month < 10)
        month = "0" + month

    let year = codice_fiscale.substring(6, 8)

    if (parseInt(year) < 30)
        year = "20" + year
    else
        year = "19" + year

    nascita.innerHTML = "<strong>Data di nascita:</strong> " + day + "/" + month + "/" + year

    let luogo = getKeyByValue(data, codice_fiscale.substring(11, 15)).toString()

    comune.innerHTML = "<strong>Comune di nascita:</strong> " + luogo
}

function isInputValid(codice_fiscale) {
    //se il codice fiscale non è lungo almeno 16 caratteri non è valido a prescindere
    if (codice_fiscale.length != 16)
        return false
    
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let num = Array.from(
        {length: 10},
        (_, index) => index
    );
    let codPari = Array.from(
        {length: 26},
        (_, index) => index
    );
    let codDispari = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23]
    let sommaCheck = 0, checkDigit

    //utilizzando l'algoritmo di calcolo del check digit, verifico che la sedicesima
    //cifra del codice fiscale inserito dall'utente sia corretta. se non coincidono,
    //il codice fiscale inserito non è valido
    for(let i = 0; i < codice_fiscale.length - 1; i++) {
        if (i % 2 == 0) {
            for(let j = 0; j < 26; j++)
                sommaCheck += (codice_fiscale.charAt(i) == letters[j]) ? codDispari[j] : 0;
    
            for(let j = 0; j < 10; j++)
                sommaCheck += (codice_fiscale.charAt(i) == num[j]) ? codDispari[j] : 0;
        }
        else {
            for(let j = 0; j < 26; j++)
                sommaCheck += (codice_fiscale.charAt(i) == letters[j]) ? codPari[j] : 0;
    
            for(let j = 0; j < 10; j++)
                sommaCheck += (codice_fiscale.charAt(i) == num[j]) ? codPari[j] : 0;
        }
    }

    checkDigit = sommaCheck % 26;
    checkDigit = String.fromCharCode(65 + checkDigit)

    if (checkDigit != codice_fiscale.charAt(15))
        return false

    return true
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
