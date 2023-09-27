import { useEffect, useState } from "react";
import {
  InputBase,
  Box,
  Title,
  Select,
  Tabs,
  Button,
  Flex,
  Progress,
  NumberInput,
} from "@mantine/core";
import CustomSelect from "./CustomSelect";
import { IconBuildingCommunity, IconPhoto, IconUser } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { set } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { filterRuleSetState } from "@atoms/icpFilterAtoms";
import { getICPRuleSet } from "@utils/requests/icpScoring";
import { userTokenState } from "@atoms/userAtoms";
import { currentProjectState } from "@atoms/personaAtoms";

function Filters(props: { isTesting: boolean, selectOptions: { value: string, label: string }[] }) {

  const userToken = useRecoilValue(userTokenState);
  const currentProject = useRecoilValue(currentProjectState);
  const [globalRuleSetData, setGlobalRuleSetData] = useRecoilState(filterRuleSetState);

  const [included_individual_title_keywords, setIncludedIndividualTitleKeywords] = useState<string[]>([]);
  const [excluded_individual_title_keywords, setExcludedIndividualTitleKeywords] = useState<string[]>([]);
  const [included_individual_industry_keywords, setIncludedIndividualIndustryKeywords] = useState<string[]>([]);
  const [excluded_individual_industry_keywords, setExcludedIndividualIndustryKeywords] = useState<string[]>([]);
  const [individual_years_of_experience_start, setIndividualYearsOfExperienceStart] = useState<number>(0);
  const [individual_years_of_experience_end, setIndividualYearsOfExperienceEnd] = useState<number>(0);
  const [included_individual_skills_keywords, setIncludedIndividualSkillsKeywords] = useState<string[]>([]);
  const [excluded_individual_skills_keywords, setExcludedIndividualSkillsKeywords] = useState<string[]>([]);
  const [included_individual_locations_keywords, setIncludedIndividualLocationsKeywords] = useState<string[]>([]);
  const [excluded_individual_locations_keywords, setExcludedIndividualLocationsKeywords] = useState<string[]>([]);
  const [included_individual_generalized_keywords, setIncludedIndividualGeneralizedKeywords] = useState<string[]>([]);
  const [excluded_individual_generalized_keywords, setExcludedIndividualGeneralizedKeywords] = useState<string[]>([]);
  const [included_company_name_keywords, setIncludedCompanyNameKeywords] = useState<string[]>([]);
  const [excluded_company_name_keywords, setExcludedCompanyNameKeywords] = useState<string[]>([]);
  const [included_company_locations_keywords, setIncludedCompanyLocationsKeywords] = useState<string[]>([]);
  const [excluded_company_locations_keywords, setExcludedCompanyLocationsKeywords] = useState<string[]>([]);
  const [company_size_start, setCompanySizeStart] = useState<number>(0);
  const [company_size_end, setCompanySizeEnd] = useState<number>(0);
  const [included_company_industries_keywords, setIncludedCompanyIndustriesKeywords] = useState<string[]>([]);
  const [excluded_company_industries_keywords, setExcludedCompanyIndustriesKeywords] = useState<string[]>([]);
  const [included_company_generalized_keywords, setIncludedCompanyGeneralizedKeywords] = useState<string[]>([]);
  const [excluded_company_generalized_keywords, setExcludedCompanyGeneralizedKeywords] = useState<string[]>([]);


  useEffect(() => {
    (async () => {
      if (!currentProject) return;

      const response = await getICPRuleSet(userToken, currentProject.id);

      if(response.status === 'success'){

        setIncludedIndividualTitleKeywords(response.data.included_individual_title_keywords ?? []);
        setExcludedIndividualTitleKeywords(response.data.excluded_individual_title_keywords ?? []);
        setIncludedIndividualIndustryKeywords(response.data.included_individual_industry_keywords ?? []);
        setExcludedIndividualIndustryKeywords(response.data.excluded_individual_industry_keywords ?? []);
        setIndividualYearsOfExperienceStart(response.data.individual_years_of_experience_start ?? 0);
        setIndividualYearsOfExperienceEnd(response.data.individual_years_of_experience_end ?? 0);
        setIncludedIndividualSkillsKeywords(response.data.included_individual_skills_keywords ?? []);
        setExcludedIndividualSkillsKeywords(response.data.excluded_individual_skills_keywords ?? []);
        setIncludedIndividualLocationsKeywords(response.data.included_individual_locations_keywords ?? []);
        setExcludedIndividualLocationsKeywords(response.data.excluded_individual_locations_keywords ?? []);
        setIncludedIndividualGeneralizedKeywords(response.data.included_individual_generalized_keywords ?? []);
        setExcludedIndividualGeneralizedKeywords(response.data.excluded_individual_generalized_keywords ?? []);
        setIncludedCompanyNameKeywords(response.data.included_company_name_keywords ?? []);
        setExcludedCompanyNameKeywords(response.data.excluded_company_name_keywords ?? []);
        setIncludedCompanyLocationsKeywords(response.data.included_company_locations_keywords ?? []);
        setExcludedCompanyLocationsKeywords(response.data.excluded_company_locations_keywords ?? []);
        setCompanySizeStart(response.data.company_size_start ?? 0);
        setCompanySizeEnd(response.data.company_size_end ?? 0);
        setIncludedCompanyIndustriesKeywords(response.data.included_company_industries_keywords ?? []);
        setExcludedCompanyIndustriesKeywords(response.data.excluded_company_industries_keywords ?? []);
        setIncludedCompanyGeneralizedKeywords(response.data.included_company_generalized_keywords ?? []);
        setExcludedCompanyGeneralizedKeywords(response.data.excluded_company_generalized_keywords ?? []);

      }

    })();
  }, [currentProject]);


  console.log(globalRuleSetData);


  useEffect(() => {

    setGlobalRuleSetData({
      included_individual_title_keywords,
      excluded_individual_title_keywords,
      included_individual_industry_keywords,
      excluded_individual_industry_keywords,
      individual_years_of_experience_start,
      individual_years_of_experience_end,
      included_individual_skills_keywords,
      excluded_individual_skills_keywords,
      included_individual_locations_keywords,
      excluded_individual_locations_keywords,
      included_individual_generalized_keywords,
      excluded_individual_generalized_keywords,
      included_company_name_keywords,
      excluded_company_name_keywords,
      included_company_locations_keywords,
      excluded_company_locations_keywords,
      company_size_start,
      company_size_end,
      included_company_industries_keywords,
      excluded_company_industries_keywords,
      included_company_generalized_keywords,
      excluded_company_generalized_keywords,
    });
    
  }, [
    included_individual_title_keywords,
    excluded_individual_title_keywords,
    included_individual_industry_keywords,
    excluded_individual_industry_keywords,
    individual_years_of_experience_start,
    individual_years_of_experience_end,
    included_individual_skills_keywords,
    excluded_individual_skills_keywords,
    included_individual_locations_keywords,
    excluded_individual_locations_keywords,
    included_individual_generalized_keywords,
    excluded_individual_generalized_keywords,
    included_company_name_keywords,
    excluded_company_name_keywords,
    included_company_locations_keywords,
    excluded_company_locations_keywords,
    company_size_start,
    company_size_end,
    included_company_industries_keywords,
    excluded_company_industries_keywords,
    included_company_generalized_keywords,
    excluded_company_generalized_keywords,
  ]);

  return (
    <Tabs defaultValue="personal">
      <Tabs.List>
        <Tabs.Tab value="personal">Person</Tabs.Tab>
        <Tabs.Tab value="company">Company</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="personal">
        <Box
          style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          py="md"
        >
          <CustomSelect
            value={included_individual_title_keywords}
            label="Titles (Included)"
            placeholder="Select options"
            setValue={setIncludedIndividualTitleKeywords}
            data={included_individual_title_keywords}
            setData={setIncludedIndividualTitleKeywords}
          />
          <CustomSelect
            value={excluded_individual_title_keywords}
            label="Titles (Excluded)"
            placeholder="Select options"
            setValue={setExcludedIndividualTitleKeywords}
            data={excluded_individual_title_keywords}
            setData={setExcludedIndividualTitleKeywords}
          />
          <CustomSelect
            value={included_individual_industry_keywords}
            label="Industry Keywords (Included)"
            placeholder="Select options"
            setValue={setIncludedIndividualIndustryKeywords}
            data={included_individual_industry_keywords}
            setData={setIncludedIndividualIndustryKeywords}
          />
          <CustomSelect
            value={excluded_individual_industry_keywords}
            label="Industry Keywords (Excluded)"
            placeholder="Select options"
            setValue={setExcludedIndividualIndustryKeywords}
            data={excluded_individual_industry_keywords}
            setData={setExcludedIndividualIndustryKeywords}
          />
          <Flex direction="column">
            <Title size={"14px"} fw={"500"}>
              Years of Experience
            </Title>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
                marginTop: "0.2rem",
              }}
            >
              <NumberInput
                value={individual_years_of_experience_start}
                placeholder="Min"
                hideControls
                onChange={(value) => setIndividualYearsOfExperienceStart(value || 0)}
              />
              <NumberInput
                value={individual_years_of_experience_end}
                placeholder="Max"
                hideControls
                onChange={(value) => setIndividualYearsOfExperienceEnd(value || 0)}
              />
            </Box>
            <Button mt={"0.5rem"} size="sm" ml={"auto"}>
              Max
            </Button>
          </Flex>
          <CustomSelect
            value={included_individual_skills_keywords}
            label="Skills Keywords (Included)"
            placeholder="Select options"
            setValue={setIncludedIndividualSkillsKeywords}
            data={included_individual_skills_keywords}
            setData={setIncludedIndividualSkillsKeywords}
          />
          <CustomSelect
            value={excluded_individual_skills_keywords}
            label="Skills Keywords (Excluded)"
            placeholder="Select options"
            setValue={setExcludedIndividualSkillsKeywords}
            data={excluded_individual_skills_keywords}
            setData={setExcludedIndividualSkillsKeywords}
          />
          <CustomSelect
            value={included_individual_locations_keywords}
            label="Location Keywords (Included)"
            placeholder="Select options"
            setValue={setIncludedIndividualLocationsKeywords}
            data={included_individual_locations_keywords}
            setData={setIncludedIndividualLocationsKeywords}
          />
          <CustomSelect
            value={excluded_individual_locations_keywords}
            label="Location Keywords (Excluded)"
            placeholder="Select options"
            setValue={setExcludedIndividualLocationsKeywords}
            data={excluded_individual_locations_keywords}
            setData={setExcludedIndividualLocationsKeywords}
          />
          <CustomSelect
            value={included_individual_generalized_keywords}
            label="Bio & Jobs Description (Included)"
            placeholder="Select options"
            setValue={setIncludedIndividualGeneralizedKeywords}
            data={included_individual_generalized_keywords}
            setData={setIncludedIndividualGeneralizedKeywords}
          />
          <CustomSelect
            value={excluded_individual_generalized_keywords}
            label="Bio & Jobs Description (Excluded)"
            placeholder="Select options"
            setValue={setExcludedIndividualGeneralizedKeywords}
            data={excluded_individual_generalized_keywords}
            setData={setExcludedIndividualGeneralizedKeywords}
          />

          <Progress />
        </Box>
      </Tabs.Panel>
      <Tabs.Panel value="company">
        <Box
          style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          py="md"
        >
          <CustomSelect
            value={included_company_name_keywords}
            label="Companies Keywords (Included)"
            placeholder="Select options"
            setValue={setIncludedCompanyNameKeywords}
            data={included_company_name_keywords}
            setData={setIncludedCompanyNameKeywords}
          />
          <CustomSelect
            value={excluded_company_name_keywords}
            label="Companies Keywords (Excluded)"
            placeholder="Select options"
            setValue={setExcludedCompanyNameKeywords}
            data={excluded_company_name_keywords}
            setData={setExcludedCompanyNameKeywords}
          />
          <CustomSelect
            value={included_company_locations_keywords}
            label="Location Keywords (Included)"
            placeholder="Select options"
            setValue={setIncludedCompanyLocationsKeywords}
            data={included_company_locations_keywords}
            setData={setIncludedCompanyLocationsKeywords}
          />
          <CustomSelect
            value={excluded_company_locations_keywords}
            label="Location Keywords (Excluded)"
            placeholder="Select options"
            setValue={setExcludedCompanyLocationsKeywords}
            data={excluded_company_locations_keywords}
            setData={setExcludedCompanyLocationsKeywords}
          />
          <Flex direction="column">
            <Title size={"14px"} fw={"500"}>
              Employee Count
            </Title>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                alignItems: "center",
                marginTop: "0.2rem",
              }}
            >
              <NumberInput
                value={company_size_start}
                placeholder="Min"
                hideControls
                onChange={(value) => setCompanySizeStart(value || 0)}
              />
              <NumberInput
                value={company_size_end}
                placeholder="Max"
                hideControls
                onChange={(value) => setCompanySizeEnd(value || 0)}
              />
            </Box>
            <Button mt={"0.5rem"} size="sm" ml={"auto"}>
              Max
            </Button>
          </Flex>
          <CustomSelect
            value={included_company_industries_keywords}
            label="Industries Keywords (Included)"
            placeholder="Select options"
            setValue={setIncludedCompanyIndustriesKeywords}
            data={included_company_industries_keywords}
            setData={setIncludedCompanyIndustriesKeywords}
          />
          <CustomSelect
            value={excluded_company_industries_keywords}
            label="Industries Keywords (Excluded)"
            placeholder="Select options"
            setValue={setExcludedCompanyIndustriesKeywords}
            data={excluded_company_industries_keywords}
            setData={setExcludedCompanyIndustriesKeywords}
          />
          <CustomSelect
            value={included_company_generalized_keywords}
            label="Company Description (Included)"
            placeholder="Select options"
            setValue={setIncludedCompanyGeneralizedKeywords}
            data={included_company_generalized_keywords}
            setData={setIncludedCompanyGeneralizedKeywords}
          />
          <CustomSelect
            value={excluded_company_generalized_keywords}
            label="Company Description (Excluded)"
            placeholder="Select options"
            setValue={setExcludedCompanyGeneralizedKeywords}
            data={excluded_company_generalized_keywords}
            setData={setExcludedCompanyGeneralizedKeywords}
          />
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}

export default Filters;