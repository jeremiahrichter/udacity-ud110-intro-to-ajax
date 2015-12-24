
function loadData() {

    /*
    The $ that shows up in variable names, like $body for example, is just a character like any other. In this case, it refers to the fact that the variable referenced by $body is a jQuery collection, not a DOM node.
    */
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=' +
        'AIzaSyD1e6s3FhzFG1CJs5lSaeaf8nfbyujmmI8';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // load nytimes
    // obviously, replace all the "X"s with your own API key
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';

    $.ajax({
        url: nytimesUrl,
        type: 'GET',
        callback: '?',
        data: {
            q: cityStr,
            sort: 'newest',
            'api-key': 'e19600402802b12907aadd9d95575178:3:73834761'
        },
        dataType: 'json',
        crossDomain: true,
        success: function (data) {
            var i;
            $nytHeaderElem.text('New York Times Articles About ' + cityStr);
            var articles = data.response.docs;
            for (i = 0; i < articles.length; i++) {
                var article = articles[i];
                $nytElem.append('<li class="article">' +
                    '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                    '<p>' + article.snippet + '</p>' +
                    '</li>');
            }
        },
        error: function (e) {
            $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
        }
    });


    // load wikipedia data
    var wikiUrl = 'https://en.wikipedia.org/w/api.php? action=opensearch&search=' +
        cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function (data) {
            data.forEach(function (datum) {
                if (typeof datum === 'string') {
                    var url = "http://en.wikipedia.org/wiki/" + datum;
                    $wikiElem.append('<li><a href="' + url + '">' +
                                    datum + '</a></li>');
                }
            });

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);
