const uri = '/User/list';
let todos = [];
var currentUser = {};

function getItems()
{
    var barcode = ajaxUtilities.getUrlParameter('barcode');
    if (barcode != null)
    {
        var promise = ajaxUtilities.GetJson(uriBarcode + barcode);
        $.when(promise).done(function (result)
        {
            currentUser = result;
            $('#currentUserText').text("hallo " + currentUser.firstname + " " + currentUser.lastname);
        }).fail(function ()
        {
            debugger;
        });
    }

}