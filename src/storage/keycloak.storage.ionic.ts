import { KeyClockStorage } from './keycloak.storage';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
 * Copyright 2017 ebondu and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * To store Keycloak objects like tokens using a localStorage.
 */
@Injectable()
export class IonicStorage implements KeyClockStorage {
  constructor(private storage: Storage) { }

  public clearExpired() {
    const time = new Date().getTime();

    this.storage.forEach((value: any, key: string) => {
      if (key && key.indexOf('kc-callback-') === 0) {
        if (value) {
          try {
            const expires = JSON.parse(value).expires;
            if (!expires || expires < time) {
              this.storage.remove(key);
            }
          } catch (err) {
            this.storage.remove(key);
          }
        }
      }
    })
  }

  public async get(state: string) {
    if (!state) {
      return;
    }

    const key = 'kc-callback-' + state;
    let value = await this.storage.get(key);

    if (value) {
      this.storage.remove(key);
      value = JSON.parse(value);
    }

    this.clearExpired();
    return value;
  }

  public add(state: any) {
    this.clearExpired();

    const key = 'kc-callback-' + state.state;
    state.expires = new Date().getTime() + 60 * 60 * 1000;
    this.storage.set(key, JSON.stringify(state));
  }
}
