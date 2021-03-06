import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as yamlWriter from '../third-party-wrappers/write-yaml';
import scaffoldSettings from './settings-scaffolder';

suite('settings', () => {
  let sandbox;
  const projectRoot = any.string();
  const projectName = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(yamlWriter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the settings file is produced', async () => {
    const description = any.sentence();
    const homepage = any.url();
    const topics = any.listOf(any.word);
    yamlWriter.default.resolves();

    await scaffoldSettings({projectRoot, projectName, description, homepage, topics});

    assert.calledWith(
      yamlWriter.default,
      `${projectRoot}/.github/settings.yml`,
      {
        _extends: '.github',
        repository: {name: projectName, description, homepage, private: true, topics: topics.join(', ')}
      }
    );
  });

  test('that the repository is marked as private when the visibility is `Private`', async () => {
    yamlWriter.default.resolves();

    await scaffoldSettings({projectRoot, visibility: 'Private'});

    assert.calledWith(
      yamlWriter.default,
      `${projectRoot}/.github/settings.yml`,
      sinon.match({repository: {private: true}})
    );
  });

  test('that the repository is marked as not private when the visibility is `Public`', async () => {
    yamlWriter.default.resolves();

    await scaffoldSettings({projectRoot, visibility: 'Public'});

    assert.calledWith(
      yamlWriter.default,
      `${projectRoot}/.github/settings.yml`,
      sinon.match({repository: {private: false}})
    );
  });

  test('that the repository is marked as private when the visibility is not specified', async () => {
    yamlWriter.default.resolves();

    await scaffoldSettings({projectRoot});

    assert.calledWith(
      yamlWriter.default,
      `${projectRoot}/.github/settings.yml`,
      sinon.match({repository: {private: true}})
    );
  });
});
