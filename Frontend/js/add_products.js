$(document).ready(function () {
    var apiURL = 'http://localhost/weben-07/Backend/logic/add_product.php';

    $('#addProductForm').on('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        var formData = new FormData(this);

        $.ajax({
            url: apiURL,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Raw response:", response);
                try {
                    let result = JSON.parse(response);
                    if (result.success) {
                        alert('Produkt erfolgreich hinzugefügt!');
                        $('#addProductForm')[0].reset();
                    } else {
                        alert('Fehler beim Hinzufügen des Produkts: ' + result.message);
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    console.error('Raw response:', response);
                    alert('Fehler beim Verarbeiten der Serverantwort. Überprüfen Sie die Konsolenausgabe für weitere Details.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Fehler beim Senden der Anfrage: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });
});
