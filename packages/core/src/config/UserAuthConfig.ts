/**
 * Author: Yureswar Ravuri
 * Type: MAP
 * Objective: Config User Object
 */

export interface AuthConfigPropTypes {
  id: string,
  email: string
}

// assigning default values to the default configuration
export const AuthConfig: AuthConfigPropTypes = {
  id: '',
  email: ''
};
