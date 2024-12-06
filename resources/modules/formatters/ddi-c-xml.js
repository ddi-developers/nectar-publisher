function toDdiCXml(input){
    var ns = "ddi:codebook:2_5"

    var xmlDoc = document.implementation.createDocument(ns, "codeBook", null);

    var codeBook = xmlDoc.getElementsByTagName("codeBook")[0]

    codeBook.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    codeBook.setAttribute("xmlns:xs", "http://www.w3.org/2001/XMLSchema")
    codeBook.setAttribute("xsi:schemaLocation", "ddi:codebook:2_5 http://www.ddialliance.org/Specification/DDI-Codebook/2.5/XMLSchema/codebook.xsd")

    var fileDscr = xmlDoc.createElementNS(ns, "fileDscr")
    fileDscr.setAttribute("ID", input.fileName)

    var fileTxt = xmlDoc.createElementNS(ns, "fileTxt")
    fileTxt.appendChild(createTextNode(xmlDoc, ns, "fileName", input.fileName))
    fileTxt.appendChild(createTextNode(xmlDoc, ns, "fileType", input.mimeType))

    var dataFingerprint = xmlDoc.createElementNS(ns, "dataFingerprint")
    dataFingerprint.setAttribute("type", "dataFile")
    dataFingerprint.appendChild(createTextNode(xmlDoc, ns, "digitalFingerprintValue", input.sha256))
    dataFingerprint.appendChild(createTextNode(xmlDoc, ns, "algorithmSpecification", "SHA-256"))
    fileTxt.appendChild(dataFingerprint)

    var dimensns = xmlDoc.createElementNS(ns,"dimensns")
    dimensns.appendChild(createTextNode(xmlDoc, ns, "caseQnty", input.data.length))
    dimensns.appendChild(createTextNode(xmlDoc, ns, "varQnty", input.columns.length))

    fileDscr.appendChild(dimensns)

    fileDscr.appendChild(fileTxt)
    codeBook.appendChild(fileDscr)

    var dataDscr = xmlDoc.createElementNS(ns, "dataDscr")
    dataDscr.setAttribute("source", "producer")

    for(const column of input.columns){
        var variable = xmlDoc.createElementNS(ns, "var")
        variable.setAttribute("ID", column.id)
        variable.setAttribute("name", column.name)
        variable.setAttribute("files", input.fileName)
        variable.setAttribute("representationType", getVarRepresentationType(column))

        if(column.label){
            variable.appendChild(createTextNode(xmlDoc, ns, "labl", column.label))
        }

        if(column.description){
            variable.appendChild(createTextNode(xmlDoc, ns, "txt", column.description))
        }

        if(column.hasIntendedDataType.type === "numeric"){

            var columnValuesUnique = column.valuesUnique.map(Number)
            var statsToCompute = [Math.min, Math.max]
            var statsToComputeNames = ["min", "max"]

            for (var i = 0; i < statsToCompute.length; ++i) {
                var statComputed = statsToCompute[i](... columnValuesUnique);

                var sumStat = createTextNode(xmlDoc, ns, "sumStat", statComputed)
            sumStat.setAttribute("type", statsToComputeNames[i])
            variable.appendChild(sumStat)
            }

        }

        if(column.codeValues){
            for(const codeValue of column.codeValues){
                var catgry = xmlDoc.createElementNS(ns, "catgry")

                catgry.appendChild(createTextNode(xmlDoc, ns, "catValu", codeValue.value))

                if(codeValue.label){
                    catgry.appendChild(createTextNode(xmlDoc, ns, "labl", codeValue.label))
                }

                if(codeValue.frequency){
                    var catStat = createTextNode(xmlDoc, ns, "catStat", codeValue.frequency)
                    catStat.setAttribute("type", "freq")
                    catgry.appendChild(catStat)
                }

                variable.appendChild(catgry)
            }
        }

        if(column.varFormat){
            var varFormat = xmlDoc.createElementNS(ns, "varFormat")
            varFormat.setAttribute("type", column.varFormat.type)
            varFormat.setAttribute("schema", column.varFormat.schema)
            varFormat.setAttribute("otherCategory", column.varFormat.otherCategory)

            variable.appendChild(varFormat)
        }


        dataDscr.appendChild(variable)
    }

    codeBook.appendChild(dataDscr)

    var prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    var xmlString = new XMLSerializer().serializeToString(xmlDoc)
    return prolog + "\n" + formatXml(xmlString)
}

function getVarRepresentationType(column){
    if(column.coded){
        return "Coded"
    }else if(column.hasIntendedDataType){
        return column.hasIntendedDataType.id
    }

    return "Other"
}
