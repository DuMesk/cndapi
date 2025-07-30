const mp = new MercadoPago("TEST-9ab9cdd3-8c01-4916-b2ef-deeb22013906");

const cardForm = mp.cardForm({
  amount: "100", // Valor fictício para teste
  autoMount: true,
  form: {
    id: "payment-form",
    cardholderName: {
      id: "form-cardholderName",
      placeholder: "Nome como no cartão"
    },
    cardNumber: {
      id: "form-cardNumber",
      placeholder: "Número do cartão"
    },
    expirationDate: {
      id: "form-expirationDate",
      placeholder: "MM/AA"
    },
    securityCode: {
      id: "form-securityCode",
      placeholder: "CVV"
    },
    installments: {
      id: "form-installments"
    },
    issuer: {
      id: "form-issuer"
    },
    identificationType: {
      id: "form-identificationType"
    },
    identificationNumber: {
      id: "form-identificationNumber",
      placeholder: "12345678900"
    },
    email: {
      id: "form-email",
      placeholder: "email@example.com"
    }
  },
  callbacks: {
    onFormMounted: error => {
      if (error) return console.warn("Formulário não montado corretamente", error);
    },
    onSubmit: event => {
      event.preventDefault();

      cardForm.getCardFormData().then(async formData => {
        try {
          const response = await fetch("https://script.google.com/macros/s/AKfycbzOnRT2cyMaH649EDLvJINFvCWD5SgSxhs_cp-fEWIrj6qVjUtg-7eIop_NBeY6j0x_/exec", {
            method: "POST",
            body: JSON.stringify({
              token: formData.token,
              issuer_id: formData.issuerId,
              payment_method_id: formData.paymentMethodId,
              transaction_amount: 100,
              installments: Number(formData.installments),
              description: "Pagamento de serviço",
              payer: {
                email: formData.email,
                identification: {
                  type: formData.identificationType,
                  number: formData.identificationNumber,
                }
              }
            }),
            headers: {
              "Content-Type": "application/json"
            }
          });

          const result = await response.json();
          console.log(result);
          document.getElementById("result").innerText = result.status === "approved"
            ? "Pagamento aprovado com sucesso!"
            : `Erro: ${result.status_detail || result.message}`;
        } catch (err) {
          console.error("Erro ao processar o pagamento", err);
          alert("Erro ao processar o pagamento");
        }
      });
    }
  }
});
