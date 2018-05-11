// https://dev.fitbit.com/build/guides/settings/
function MoodSettings(props) {
  return (
    <Page>
      <Section
        description={<Text>
          To access your account dashboard, go to <Link source="https://moodhq.herokuapp.com">moodhq.herokuapp.com</Link>, click on the menu button and register the token you have setup here. Once registered, you will be able to configure additional settings and review all your logged reports.
        </Text>}
        title={<Text bold align="center">Authentication</Text>}>
         <TextInput
          title="Access Token"
          placeholder="mysecretcode"
          settingsKey="token"
        />
      </Section>
      <Section
        description={<Text>
          By adding your telephone number, you can have Mood Meter periodically prompt you by text message to report your mood. You must also select how often you wish to be prompted and the hours during which you should not be notified.
        </Text>}
        title={<Text bold align="center">Prompts</Text>}>
         <TextInput
          title="Prompt Number"
          placeholder="901.234.5678"
          settingsKey="prompt"
        />
        <Select
          label={`Prompt Interval`}
          settingsKey="prompt_interval"
          options={[
            {name:"None", value: "None" },
            {name:"Random", value: "Random" },
            {name:"Every One Hour", value: "1" },
            {name:"Every Two Hours", value: "2" },
            {name:"Every Three Hours", value: "3" }
          ]}
        />
        <Select
          label={`Wake Prompts`}
          settingsKey="prompt_wake"
          options={[
            {name:"12:00am", value: "00:00" },
            {name:"1:00am", value: "01:00" },
            {name:"2:00am", value: "02:00" },
            {name:"3:00am", value: "03:00" },
            {name:"4:00am", value: "04:00" },
            {name:"5:00am", value: "05:00" },
            {name:"6:00am", value: "06:00" },
            {name:"7:00am", value: "07:00" },
            {name:"8:00am", value: "08:00" },
            {name:"9:00am", value: "09:00" },
            {name:"10:00am", value: "10:00" },
            {name:"11:00am", value: "11:00" },
            {name:"12:00pm", value: "12:00" },
            {name:"1:00pm", value: "13:00" },
            {name:"2:00pm", value: "14:00" },
            {name:"3:00pm", value: "15:00" },
            {name:"4:00pm", value: "16:00" },
            {name:"5:00pm", value: "17:00" },
            {name:"6:00pm", value: "18:00" },
            {name:"7:00pm", value: "19:00" },
            {name:"8:00pm", value: "20:00" },
            {name:"9:00pm", value: "21:00" },
            {name:"10:00pm", value: "22:00" },
            {name:"11:00pm", value: "23:00" },
          ]}
        />
        <Select
          label={`Sleep Prompts`}
          settingsKey="prompt_sleep"
          options={[
            {name:"12:00am", value: "00:00" },
            {name:"1:00am", value: "01:00" },
            {name:"2:00am", value: "02:00" },
            {name:"3:00am", value: "03:00" },
            {name:"4:00am", value: "04:00" },
            {name:"5:00am", value: "05:00" },
            {name:"6:00am", value: "06:00" },
            {name:"7:00am", value: "07:00" },
            {name:"8:00am", value: "08:00" },
            {name:"9:00am", value: "09:00" },
            {name:"10:00am", value: "10:00" },
            {name:"11:00am", value: "11:00" },
            {name:"12:00pm", value: "12:00" },
            {name:"1:00pm", value: "13:00" },
            {name:"2:00pm", value: "14:00" },
            {name:"3:00pm", value: "15:00" },
            {name:"4:00pm", value: "16:00" },
            {name:"5:00pm", value: "17:00" },
            {name:"6:00pm", value: "18:00" },
            {name:"7:00pm", value: "19:00" },
            {name:"8:00pm", value: "20:00" },
            {name:"9:00pm", value: "21:00" },
            {name:"10:00pm", value: "22:00" },
            {name:"11:00pm", value: "23:00" },
          ]}
        />
      </Section>
      <Section
        description={<Text>
          Mood Meter is also able to alert a caregiver by text message whenever you report a mood. To setup a caregiver to be alerted, add the phone number to reach the caregiver.
        </Text>}
        title={<Text bold align="center">Alerts</Text>}>
         <TextInput
          title="Alert Number"
          placeholder="901.234.5678"
          settingsKey="alert"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(MoodSettings);