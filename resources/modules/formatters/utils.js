
class Code{
    id
    prefLabel
    notation
    definition
    inScheme
    constructor(id, notation, inScheme){
        this.id = id
        this.notation = notation
        this.inScheme = inScheme
    }
    toJSON(){
        return {
            '@id' : '#' + this.id,
            '@type' : 'skos:Concept',
            'notation' : this.notation,
            'prefLabel' : this.prefLabel,
            'definition' : this.definition,
            'inScheme' : this.inScheme
        }
    }
}

function formatXml(xml, tab) { // tab = optional indent value, default is tab (  )
    var formatted = '', indent= '';
    tab = tab || '  ';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
}

function createTextNode(xmlDoc, ns, name, text){
    var element = xmlDoc.createElementNS(ns,name)
    var elementText = xmlDoc.createTextNode(text)
    element.appendChild(elementText)
    return element
}

function saveFileBrowser(fileName, content){

    var downloadLink = document.createElement("a")
    downloadLink.download = fileName
    downloadLink.innerHTML = "Download File"
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(content)
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(content)
      downloadLink.onclick = destroyClickedElement
      downloadLink.style.display = "none"
      document.body.appendChild(downloadLink)
    }

    downloadLink.click();
}

function CSVToArray(strData, strDelimiter){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

function hashString(string, type){
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest(type, utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });
}

function getColumnValues(csv, columnIndex, haveHeader){
    var startRow = 0
    if(haveHeader) startRow = 1;

    var column = [];
    for(var i=startRow; i<csv.length; i++){
       column.push(csv[i][columnIndex]);
    }
    return column;
}

function getCsvExamples(){
    return [
        {
            fileName: "test.csv",
            raw:"Frequency,Year,Age Cohort,Sex,Status,Median Income (USD)\nA,2003,C,M,ACT,5500\nA,2003,G,F,ACT,7500\nA,2004,E,M,EST,10000\nA,2005,B,F,ACT,14000\nA,2004,B,M,EST,2000"
        },
        {
            fileName: "tiny.csv",
            raw:"id,name,value,some date\n0,Pelle,13,2010-01-12\n1,Claus,15,2020-10-10"
        },
        {
            fileName: "spss_example.csv",
            raw: "RID,MARST,PWT\n10000001,3,537\m10000002,1,231\n10000003,2,599\n10000004,1,4003\n10000005,2,598"
        },
        {
            fileName: "canada_juvenile_crime.csv",
            raw: "Offense,Year,Geography,TotalNumber of Cases\nTotal guilty cases - sentences,2017/2018,Canada,14227\nTotal guilty cases - sentences, 2018/2019,Canada,12167\nTotal guilty cases - sentences,2019/202,Canada,10861\nTotal guilty cases - sentences,2020/2021,Canada,6594\nTotal guilty cases - sentences,2021/2022,Canada,4688\nIntensive rehabilitation custody and supervision,2017/2018,Canada,7\nIntensive rehabilitation custody and supervision,2018/2019,Canada,5\nIntensive rehabilitation custody and supervision,2019/2020,Canada,5\nIntensive rehabilitation custody and supervision,2020/2021,Canada,12\nIntensive rehabilitation custody and supervision,2021/2022,Canada,7\nCustody,2017/2018,Canada,1811\nCustody,2018/2019,Canada,1457\nCustody,2019/2020,Canada,1260\nCustody,2020/2021,Canada,653\nCustody,2021/2022,Canada,402\nConditional sentence,2017/12018,Canada,10\nConditional sentence,2018/12019,Canada,8\nConditional sentence,2019/12020,Canada,15\nConditional sentence,2020/12021,Canada,4\nConditional sentence,2021/12022,Canada,12\nDeferred custody and supervision,2017/2018,Canada,670\nDeferred custody and supervision,2018/2019,Canada,527\nDeferred custody and supervision,2019/2020,Canada,527\nDeferred custody and supervision,2020/2021,Canada,297\nDeferred custody and supervision,2021/2022,Canada,228\nIntensive support and supervision,2017/2018,Canada,117\nIntensive support and supervision,2018/2019,Canada,124\nIntensive support and supervision,2019/2020,Canada,99\nIntensive support and supervision,2020/2021,Canada,63\nIntensive support and supervision,2021/2022,Canada,66\nAttend a non-residential program,2017/2018,Canada,98\nAttend a non-residential program,2018/2019,Canada,63\nAttend a non-residential program,2019/2020,Canada,60\nAttend a non-residential program,2020/2021,Canada,28\nAttend a non-residential program,2021/2022,Canada,11\nProbation,2017/2018,Canada,7154\nProbation,2018/2019,Canada,6195\nProbation,2019/2020,Canada,5572\nProbation,2020/2021,Canada,3411\nProbation,2021/2022,Canada,2449\nFine,2017/2018,Canada,285\nFine,2018/2019,Canada,224\nFine,2019/2020,Canada,179\nFine,2020/2021,Canada,133\nFine,2021/2022,Canada,102"
        }
    ]
}

function getColTypes(){
    return [
        {label: "Text", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#String"},
        {label: "Integer", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#Integer"},
        {label: "Double", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#Double"},
        {label: "Date", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#Date"},
        {label: "DateTime", id: "http://rdf-vocabulary.ddialliance.org/cv/DataType/1.1.2/#DateTime"}
    ]
}

function isEmpty(value) {
    return value === undefined || value === null || value === ''
}

function guessType(values){
    const intReg = /^(- ?)?\d{1,3}(([. '`]?\d{3})*|([, '`]?\d{3})*)?$/;
    const doubleReg = /^(- ?)?\d{1,3}(([. '`]?\d{3})*(,\d+)|([, '`]?\d{3})*(.\d+))?$/ // /^-?(\d+\.\d*|\.?\d+)$/
    const dateReg = /^\d{4}-(0\d|1[0-2])-([0-2]\d|3[01])$/
    const dateTimeReg = /^(19|20)(\d{2})-(0\d|1[0-2])-([0-2]\d|3[01])[T ]([0-1]\d|2[0-3]):([0-5]\d)(:([0-5]\d)(\.\d{1,3})?)?(Z|[+-]([0-1]\d|2[0-3]):([0-5]\d))?$/

    if(values.every(i => intReg.test(i) || isEmpty(i))) return 'numeric';

    if(values.every(i => doubleReg.test(i) || isEmpty(i))) return 'numeric';

    // TODO: work out a better date test
    if(values.every(i => dateReg.test(i) || isEmpty(i))) return 'date';
    if(values.every(i => dateTimeReg.test(i) || isEmpty(i))) return 'datetime';

    if(values.every(i => typeof i === "string" || isEmpty(i))) return 'text';
    return null;
}

function guessDataType(values) {
    /*
    https://vocabularies.cessda.eu/vocabulary/DataType?lang=en
    unhandled data types:
    // NormalizedString
    // Long
    // Int
    // GDay
    // GMonth
    // Other
    */

    // Boolean
    if (values.every(i => (/^(?:true|false|1|0)$/i.test(i)) || isEmpty(i))) return 'Boolean';

    // Unasigned byte
    // Whole numbers in the range 0 - 255.
    if (values.every(i => (/^\d+$/.test(i) && i >= 0 && i <= 255) || isEmpty(i))) return 'UnsignedByte';

    // Unsigned short
    // Whole numbers in the range 0 - 65535.
    if (values.every(i => (/^\d+$/.test(i) && i >= 0 && i <= 65535) || isEmpty(i))) return 'UnsignedShort';

    // Unsigned int
    // Whole numbers in the range 0 - 4294967295.
    if (values.every(i => (/^\d+$/.test(i) && i >= 0 && i <= 4294967295) || isEmpty(i))) return 'UnsignedInt';

    // Unsigned long
    // Whole numbers in the range 0 - 18446744073709551615.
    if (values.every(i => (/^\d+$/.test(i) && i >= 0 && i <= 18446744073709551615) || isEmpty(i))) return 'UnsignedLong';

    // Byte
    // Whole numbers in the range -128 - 127.
    if (values.every(i => (/^-?\d+$/.test(i) && i >= -128 && i <= 127) || isEmpty(i))) return 'Byte';

    // Short
    // Whole numbers in the range -32768 - 32767.
    if (values.every(i => (/^-?\d+$/.test(i) && i >= -32768 && i <= 32767) || isEmpty(i))) return 'Short';

    const regex = {
        NonNegativeInteger: /^[1-9]\d*$/,
        NonPositiveInteger: /^-[1-9]\d*$/,
        PositiveInteger: /^\d+$/,
        NegativeInteger: /^-\d+$/,
        Integer: /^-?\d+$/,
        Decimal: /^[+-]?\d*([.,]\d+)?$/,
        // Double / Float
        Double: /^(- ?)?(\d+([.,]\d+([eE]-?\d+)?|([eE]\d+))?|INF)$/,

        DateTime: /^(19|20)(\d{2})-(0\d|1[0-2])-([0-2]\d|3[01])[T ]([0-1]\d|2[0-3]):([0-5]\d)(:([0-5]\d)(\.\d{1,3})?)?(Z|[+-]([0-1]\d|2[0-3]):([0-5]\d))?$/,
        // Date
        // Integer-valued year, month, day, and time zone hour and minutes, e.g., 2003-06-30-05:00 (30 June 2003 Eastern Standard Time U.S.).
        Date: /^(19|20)(\d{2})-(0\d|1[0-2])-([0-2]\d|3[01])(-([0-1]\d|2[0-3]):([0-5]\d))?$/,
        // Time
        // Left-truncated dateTime, e.g., 13:20:00-05:00 (1:20 pm for Eastern Standard Time U.S.).
        Time: /^([0-1]\d|2[0-3]):([0-5]\d)(:([0-5]\d)(\.\d{1,3})?)?([+-]([0-1]\d|2[0-3]):([0-5]\d))?$/,
        // YearMonth
        // Integer-valued year and month, e.g., 2004-11.
        GYearMonth: /^(19|20)\d{2}-(0\d|1[0-2])$/,
        // Year
        // Integer-valued year, e.g., 2005.
        GYear: /^(19|20)\d{2}$/,
        // MonthDay
        // Integer-valued month and day, e.g., 12-31.
        GMonthDay: /^(0\d|1[0-2])-([0-2]\d|3[01])$/,

        HexBinary: /^(?:[0-9a-fA-F]{2})+$/,
        Base64Binary: /^(?:[A-Za-z0-9+/]{4})*$/,
        AnyURI: /^(?:ftps?|https?|wss?):\/\/(?:[a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(?:\/\S*)?$/,
        Duration: /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.(\d+))?S)?)?$/,
    }

    let result = null;
    for (let regexKey in regex) {
        if (values.every(i => regex[regexKey].test(i) || isEmpty(i))) {
            result = regexKey;
            break;
        }
    }
    if (result !== null) {
        return result;
    }

    // String
    // Finite sequences of characters. A character is an atomic unit of written communication; it is not further specified except to note that every character has a corresponding Universal Character Set code point (which is an integer).
    if(values.every(i => typeof i === "string" || isEmpty(i))) return 'String';

    return null;
}

function guessDelimiter(csvContent){
    for(const delimiter of [',', ';', '|', '\t']){
        var csv = CSVToArray(csvContent, delimiter)
        // TODO: do a bit more intelligent check...
        if(csv[0].length > 1 && csv.length > 1) return delimiter;
    }

    return ','
}
