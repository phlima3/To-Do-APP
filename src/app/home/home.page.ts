import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tarefas: string[] = [];
  tarefasBackup: string[] = [];
  novaTarefa = '';
  constructor(private storage: Storage, private toast: ToastController) {
    this.iniciarBanco();
  }
  async desfazer(tarefaExcluida) {
    const t = await this.toast.create({
      message: 'Excluído: ' + tarefaExcluida,
      duration: 3000,
      buttons: [
        {
          text: 'Desfazer',
          handler: async () => {
            this.tarefas = [...this.tarefasBackup];
            await this.storage.set('tarefas', this.tarefas);
          },
        },
      ],
    });
    t.present();
  }
  async iniciarBanco() {
    await this.storage.create();
    this.tarefas = (await this.storage.get('tarefas')) ?? [];
  }
  async cadastrarTarefa() {
    this.tarefas.push(this.novaTarefa);
    this.novaTarefa = '';
    await this.storage.set('tarefas', this.tarefas);
  }
  async removerTarefa(posicao) {
    this.desfazer(this.tarefas[posicao]);
    this.tarefasBackup = [...this.tarefas];
    this.tarefas.splice(posicao, 1);
    await this.storage.set('tarefas', this.tarefas);
  }
}
