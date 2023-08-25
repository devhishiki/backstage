/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Entity } from '@backstage/catalog-model';
import { getAnnotationValuesFromEntity } from './getAnnotationValuesFromEntity';

describe('getAnnotationValuesFromEntity', () => {
  describe('with valid project-repo annotation', () => {
    it('should return project and repo', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
          },
        },
      };
      const { project, repo, definition, org } =
        getAnnotationValuesFromEntity(entity);
      expect(project).toEqual('projectName');
      expect(repo).toEqual('repoName');
      expect(definition).toEqual(undefined);
      expect(org).toEqual(undefined);
    });
  });

  describe('with invalid project-repo annotation', () => {
    it('should throw incorrect format error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'project',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Value for annotation dev.azure.com/project-repo was not in the correct format: <project-name>/<repo-name>',
      );
    });
  });

  describe('with project-repo annotation missing project', () => {
    it('should throw missing project error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': '/repo',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Project Name for annotation dev.azure.com/project-repo was not found; expected format is: <project-name>/<repo-name>',
      );
    });
  });

  describe('with project-repo annotation missing repo', () => {
    it('should throw missing repo error', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'project/',
          },
        },
      };

      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Repo Name for annotation dev.azure.com/project-repo was not found; expected format is: <project-name>/<repo-name>',
      );
    });
  });

  describe('with valid project and build-definition annotations', () => {
    it('should return project and definition', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-build-definition',
          annotations: {
            'dev.azure.com/project': 'projectName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      const { project, repo, definition, org } =
        getAnnotationValuesFromEntity(entity);
      expect(project).toEqual('projectName');
      expect(repo).toEqual(undefined);
      expect(definition).toEqual('buildDefinitionName');
      expect(org).toEqual(undefined);
    });
  });

  describe('with only project annotation', () => {
    it('should return project and definition', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project',
          annotations: {
            'dev.azure.com/project': 'projectName',
          },
        },
      };
      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Value for annotation dev.azure.com/build-definition was not found',
      );
    });
  });

  describe('with only build-definition annotation', () => {
    it('should return project and definition', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'build-definition',
          annotations: {
            'dev.azure.com/build-definition': 'buildDefinitionName',
          },
        },
      };
      const test = () => {
        return getAnnotationValuesFromEntity(entity);
      };

      expect(test).toThrow(
        'Value for annotation dev.azure.com/project was not found',
      );
    });
  });

  describe('with valid project-repo and org annotations', () => {
    it('should return project, repo, and org', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-repo',
          annotations: {
            'dev.azure.com/project-repo': 'projectName/repoName',
            'dev.azure.com/organization': 'organizationName',
          },
        },
      };
      const { project, repo, definition, org } =
        getAnnotationValuesFromEntity(entity);
      expect(project).toEqual('projectName');
      expect(repo).toEqual('repoName');
      expect(definition).toEqual(undefined);
      expect(org).toEqual('organizationName');
    });
  });

  describe('with valid project, build-definition, and org annotations', () => {
    it('should return project, definition, and org', () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'project-build-definition',
          annotations: {
            'dev.azure.com/project': 'projectName',
            'dev.azure.com/build-definition': 'buildDefinitionName',
            'dev.azure.com/organization': 'organizationName',
          },
        },
      };
      const { project, repo, definition, org } =
        getAnnotationValuesFromEntity(entity);
      expect(project).toEqual('projectName');
      expect(repo).toEqual(undefined);
      expect(definition).toEqual('buildDefinitionName');
      expect(org).toEqual('organizationName');
    });
  });
});
