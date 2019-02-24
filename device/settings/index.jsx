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
    </Page>
  );
}

registerSettingsPage(MoodSettings);