const uri = '/User/list';
let todos = [];

function getItems()
{
    var promise = ajaxUtilities.GetJson(uri);
    $.when(promise).done(function (result)
    {
        todos = result;
    }).fail(function ()
    {
        debugger;
    });
}