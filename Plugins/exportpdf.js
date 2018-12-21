function HTMLtoPDF() {
    var pdf = new jsPDF('p', 'pt', 'letter');
    var source = $('#HTMLtoPDF')[0];
    // $('#HTMLtoPDF')[0];
    specialElementHandlers = {
        '#bypassme': function (element, renderer) {
            return true
        }
    }
    margins = {
        top: 5,
        left: 30,
        right: 30,
        width: 1200
    };
    pdf.fromHTML(
        source // HTML string or DOM elem ref.
        , margins.left
        , margins.right  // x coord
        , margins.top // y coord
        , {
            'width': margins.width // max width of content on PDF
            , 'elementHandlers': specialElementHandlers
        },
        function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF
            //          this allow the insertion of new lines after html
            pdf.save('html2pdf.pdf');
        }
    )
}