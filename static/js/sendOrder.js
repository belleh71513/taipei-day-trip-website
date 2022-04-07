
TPDirect.setupSDK(123998, "app_yF5llo3O6gk0wj4TBYiu0G4zwfv48mVhMRfzCO6eKwEz5PIg6nMXlCz6bWFR", "sandbox");

let setup = {
  fields : {
    number : {
      element : "#tap-card-number",
      placeholder: "**** **** **** ****"
    },
    expirationDate: {
      element: document.getElementById('card-exp-date'),
      placeholder: 'MM / YY'
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'CCV'
    }
  },
  style : {
    "input" : {
      "color" : "gray"
    },
    ":focus" : {
      "color" : "black"
    },
    ".valid" : {
      "color" : "green"
    },
    ".invalid" : {
      "color" : "red"
    }
  }
}

TPDirect.card.setup(setup)

function onClick(e) {
  e.preventDefault();
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if(tappayStatus.canGetPrime === false) {
    alert("can not get prime")
    return
  }

  // Get Prime
  TPDirect.card.getPrime( result => {
    if(result.status !==0) {
      alert(`get prime error${result.msg}`)
      return
    }
    alert(`get prime 成功，prime : ${result.card.prime}`)
  })

}




// TPDirect.card.onUpdate(update => {
//   const confirmBtn = document.querySelector(".confirm-btn")
//   if(update.canGetPrime){
//     confirmBtn.removeAttribute("disabled")
//   }else{
//     confirmBtn.setAttribute("disabled", true)
//   }
// })

// if (update.status.number === 2) {
//   setNumberFormGrup
// }




// function setNumberFormGroupToError(selector) {
//   const elementError = document.querySelector(selector)
//   elementError.classList.add("has-error")
//   elementError.classList.remove("has-success")
// }

// function setNumberFormGroupToSuccess(selector) {
//   const elementSuccess = document.querySelector(selector)
//   elementSuccess.classList.remove("has-error")
//   elementSuccess.classList.add("has-success")
// }

// function setNumberFormGroupToNormal(selector) {
//   const elementNormal = document.querySelector(selector)
//   elementNormal.classList.remove("has-error")
//   elementNormal.classList.remove("has-success")
// }