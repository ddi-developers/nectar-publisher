const questionnaireExample = {
	"intervInstrSchemeUuid": "iis123",
	"respInstrSchemeUuid": "ris123",
	"progInstrSchemeUuid": "pis123",
	"questionSchemeUuid": "qs123",
    "interviewerInstructions": [
	    {
		    "uuid": "ii123",
		    "instructionText": "please show card A"
		},
		{
		    "uuid": "ii124",
		    "instructionText": "please show card B"
		},
		{
		    "uuid": "ii125",
		    "instructionText": "please show card C"
		}
    ],
    "respondentInstructions": [
	    {
		    "uuid": "ri123",
		    "instructionText": "We keep your answers confidential."
		}
    ],
    "programmingInstructions": [
	    {
		    "uuid": "pi123",
		    "instructionText": "if 0 forward to Qlicense"
		}
    ],
    "questions": [
        {
    	    "uuid": "q123",
    	    "answerType": "numeric",
			"multipleItems": false,
			"multipleAnswers": false,
    		"questionName": "Qage",
			"concept": "Age",
        	"questionText": "How old are you?",
			"answerLabel": "years"
    	},
		{
    	    "uuid": "q124",
    	    "answerType": "coded",
			"multipleItems": false,
			"multipleAnswers": false,
    		"questionName": "Qcar",
			"concept": "car owned",
        	"questionText": "Do you own a car?",
    		"interviewerInstructionReference": "ii123",
    		"programmingInstructionReference": "pi123",
    		"answerCodesReference": "a123"
    	},
		{
    	    "uuid": "q126",
    	    "answerType": "coded",
			"multipleItems": false,
			"multipleAnswers": false,
    		"questionName": "Qcarcolor",
			"concept": "car owned",
        	"questionText": "Which color is your car?",
    		"interviewerInstructionReference": "ii124",
    		"answerCodesReference": "a124"
    	},
		{
			"uuid": "q125",
			"answerType": "coded",
			"multipleItems": false,
			"multipleAnswers": false,
			"questionName": "Qformercar",
			"concept": "car owned",
			"questionText": "Did you ever own a different car?",
			"interviewerInstructionReference": "ii123",
			"programmingInstructionReference": "pi123",
			"answerCodesReference": "a123"
		},
		{
    	    "uuid": "q127",
    	    "answerType": "coded",
			"multipleItems": true,
			"multipleAnswers": false,
    		"questionName": "Qcarbrand",
			"concept": "car owned",
        	"questionText": "Which brands were your cars of?",
    		"interviewerInstructionReference": "ii123",
			"itemCodesReference": "i123",
    		"answerCodesReference": "a123"
    	},
		{
    	    "uuid": "q128",
    	    "answerType": "coded",
			"multipleItems": false,
			"multipleAnswers": true,
    		"questionName": "Qformercarcolor",
			"concept": "Alter",
        	"questionText": "Of whiche color were your previous cars?",
    		"interviewerInstructionReference": "ii124",
    		"answerCodesReference": "a124"
    	},
		{
    	    "uuid": "q129",
    	    "answerType": "coded",
			"multipleItems": false,
			"multipleAnswers": false,
    		"questionName": "Qlicense",
			"concept": "driving license",
        	"questionText": "Did you ever drive without owning a valid license?",
    		"interviewerInstructionReference": "ii125",
    		"respondentInstructionReference": "ri123",
    		"answerCodesReference": "a125"
    	}
    ],
    "items": [
	    {
			"uuid": "i123",
			"name": "Brands",
			"codeValues": [
			    {
        			"uuid": "e123",
		    		"value": "A",
		    		"label": "Audi"
				},
				{
        			"uuid": "e124",
		    		"value": "B",
		    		"label": "BMW"
				},
				{
        			"uuid": "e125",
		    		"value": "C",
				    "label": "Mercedes"
				},
				{
        			"uuid": "e126",
		    		"value": "D",
		    		"label": "Porsche"
				},
				{
        			"uuid": "e127",
		    		"value": "E",
		    		"label": "Volkswagen"
				}
			]
		}
    ],
    "answers": [
	    {
			"uuid": "a123",
			"name": "Dichotom",
			"codeValues": [
				{
        			"uuid": "e223",
				    "value": "0",
				    "label": "no"
			    },
				{
        			"uuid": "e224",
				    "value": "1",
				    "label": "yes"
			    }
			]
		},
		{
			"uuid": "a124",
			"name": "colors",
			"codeValues": [
				{
        			"uuid": "e323",
				    "value": "1",
				    "label": "red"
			    },
				{
        			"uuid": "e324",
				    "value": "2",
				    "label": "green"
			    },
				{
        			"uuid": "e325",
				    "value": "3",
				    "label": "black"
			    },
				{
        			"uuid": "e326",
				    "value": "4",
				    "label": "silver"
			    },
				{
        			"uuid": "e327",
				    "value": "5",
				    "label": "white"
			    },
				{
        			"uuid": "e328",
				    "value": "6",
				    "label": "misc."
			    }
			]
		},
	    {
			"uuid": "a125",
			"name": "Dichtom + 2 Missings",
			"codeValues": [
				{
        			"uuid": "e423",
				    "value": "0",
				    "label": "no"
			    },
				{
        			"uuid": "e424",
				    "value": "1",
				    "label": "yes"
			    },
				{
        			"uuid": "e425",
				    "value": "99",
				    "label": "don't know",
					"isMissingValue": true
			    },
				{
        			"uuid": "e426",
				    "value": "98",
				    "label": "no answer",
					"isMissingValue": true
			    }
			]
		}
    ]
}