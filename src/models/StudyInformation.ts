// Controlled lists used by the select boxes in the Dataset Information tab.
// Title types are taken from DataCite, contributor role, time method, sampling procedure and
// mode of collection from the DDI Alliance controlled vocabularies (versions in DdiVocabularies).
export const TitleTypes = ['AlternativeTitle', 'Subtitle', 'TranslatedTitle', 'Other'];

export const Availabilities = ['Open access', 'Restricted access', 'Embargoed access', 'Closed access'];

export const DdiVocabularies = {
  contributorRole: { id: 'ContributorRole', version: '1.0.3' },
  timeMethod: { id: 'TimeMethod', version: '1.2.3' },
  samplingProcedure: { id: 'SamplingProcedure', version: '2.0.2' },
  modeOfCollection: { id: 'ModeOfCollection', version: '5.0.1' }
};

export function vocabularyUri(vocabulary: { id: string, version: string }): string {
  return `http://rdf-vocabulary.ddialliance.org/cv/${vocabulary.id}/${vocabulary.version}/`;
}

export const ContributorRoles = [
  'ProjectOrStudyDesign', 'ProjectOrStudyDesign.Conceptualization', 'ProjectOrStudyDesign.InstrumentDesign',
  'ProjectOrStudyDesign.MethodologyDevelopment', 'ProjectOrStudyDesign.WeightsDesign',
  'ProjectOrStudyDesign.StandardsDevelopment', 'ProjectOrStudyDesign.DataModeling',
  'ProjectOrStudyDesignSamplingDesign', 'DataManagement', 'EthicsReview', 'DataCollection',
  'SampleSelection', 'DataEntry', 'DataProcessing', 'DataProcessing.DisclosureControl',
  'DataProcessing.DataAggregation', 'DataProcessing.DataIntegration', 'DataProcessing.DataValidation',
  'DataAcquisition', 'MetadataProduction', 'DataDistribution', 'DataHosting',
  'LongTermPreservationOrArchiving', 'Consulting', 'Contact', 'DataAnalysis', 'Editing',
  'EquipmentDevelopment', 'Evaluation', 'FundingProvision', 'FundingOrSponsorshipAcquisition', 'Sponsorship',
  'GraphicDesign', 'ProjectOperations', 'ProjectOperations.ProjectLeader',
  'ProjectOperations.ProjectManager', 'ProjectOperations.ProjectMember', 'Promotion',
  'RegistrationAuthority', 'Researcher', 'ResearchGroup', 'RightsHolding', 'RightsManagement',
  'SoftwareDevelopment', 'Supervision', 'Training', 'Translation', 'UserSupport', 'Visualization',
  'WebsiteDevelopment', 'Other'
];

export const TimeMethods = [
  'Longitudinal', 'Longitudinal.CohortEventBased', 'Longitudinal.TrendRepeatedCrossSection',
  'Longitudinal.Panel', 'Longitudinal.Panel.Continuous', 'Longitudinal.Panel.Interval', 'TimeSeries',
  'TimeSeries.Continuous', 'TimeSeries.Discrete', 'CrossSection', 'CrossSectionAdHocFollowUp', 'Other'
];

export const SamplingProcedures = [
  'TotalUniverseCompleteEnumeration', 'Probability', 'Probability.SimpleRandom',
  'Probability.SystematicRandom', 'Probability.Stratified', 'Probability.Stratified.Proportional',
  'Probability.Stratified.Disproportional', 'Probability.Cluster', 'Probability.Cluster.SimpleRandom',
  'Probability.Cluster.StratifiedRandom', 'Probability.Multistage', 'TheoreticalSampling', 'Nonprobability',
  'Nonprobability.Availability', 'Nonprobability.Purposive', 'Nonprobability.Quota',
  'Nonprobability.RespondentAssisted', 'MixedProbabilityNonprobability', 'Other'
];

export const CollectionModes = [
  'Interview', 'Interview.FaceToFace', 'Interview.FaceToFace.CAPIorCAMI', 'Interview.FaceToFace.PAPI',
  'Interview.Telephone', 'Interview.Telephone.CATI', 'Interview.Email', 'Interview.WebBased',
  'SelfAdministeredQuestionnaire', 'SelfAdministeredQuestionnaire.Email',
  'SelfAdministeredQuestionnaire.Paper', 'SelfAdministeredQuestionnaire.SMSorMMS',
  'SelfAdministeredQuestionnaire.CAWI', 'SelfAdministeredQuestionnaire.CASI', 'FocusGroup',
  'FocusGroup.FaceToFace', 'FocusGroup.Telephone', 'FocusGroup.Online', 'SelfAdministeredWritingsAndDiaries',
  'SelfAdministeredWritingsAndDiaries.Email', 'SelfAdministeredWritingsAndDiaries.Paper',
  'SelfAdministeredWritingsAndDiaries.WebBased', 'Observation', 'Observation.Field',
  'Observation.Field.Participant', 'Observation.Field.Nonparticipant', 'Observation.Laboratory',
  'Observation.Laboratory.Participant', 'Observation.Laboratory.Nonparticipant', 'Observation.ComputerBased',
  'Experiment', 'Experiment.Laboratory', 'Experiment.FieldIntervention', 'Experiment.WebBased', 'Recording',
  'Recording.RemoteSensing', 'AutomatedDataExtraction', 'AutomatedDataExtraction.ApiQuery',
  'AutomatedDataExtraction.DatabaseQuery', 'AutomatedDataExtraction.WebScraping', 'ContentCoding',
  'Transcription', 'CompilationSynthesis', 'Summary', 'Aggregation', 'Simulation', 'MeasurementsAndTests',
  'MeasurementsAndTests.Cognitive', 'MeasurementsAndTests.Educational', 'MeasurementsAndTests.Physical',
  'MeasurementsAndTests.Psychological', 'Other'
];

export const CollectionDateFormats = ['yyyy', 'yyyy-mm', 'yyyy-mm-dd'];

export class AlternativeTitle {
  public title: string = '';
  public type: string = '';
}

export class Agent {
  public name: string = '';
  public institution: string = '';
}

export class Contributor extends Agent {
  public role: string = '';
}

export class CollectionPeriod {
  public start: string = '';
  public end: string = '';
}

export class Publication {
  public citation: string = '';
  public identifier: string = '';
}

// Additional study level metadata. Title and abstract are kept in
// Dataset.studyName and Dataset.studyDescription.
export class StudyInformation {
  // basic information
  public alternativeTitles: AlternativeTitle[] = [new AlternativeTitle()];
  public principalInvestigators: Agent[] = [new Agent()];
  public publishers: string[] = [''];
  public publicationYear: number | undefined;
  public availability: string = '';
  public contributors: Contributor[] = [new Contributor()];
  public funders: string[] = [''];
  // content description
  public subjects: string[] = [''];
  public topicKeywords: string[] = [''];
  public thesozKeywords: string[] = [''];
  // methodology
  public countries: string[] = [''];
  public regions: string[] = [''];
  public timeMethods: string[] = [''];
  public universe: string = '';
  public samplingProcedures: string[] = [''];
  public collectionModes: string[] = [''];
  public collectionDateFormat: string = 'yyyy-mm-dd';
  public collectionPeriods: CollectionPeriod[] = [new CollectionPeriod()];
  // further notes
  public publications: Publication[] = [new Publication()];
  public notes: string = '';
}
