import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  configForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.configForm = this.formBuilder.group({
      clusterName: ['sandbox', [Validators.required]],
      baseDomain: ['ocp.lob.company.com', [Validators.required]],
      pullSecret: ['', [Validators.required]],
      publicSshKey: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.configForm.invalid) {
      return;
    }
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.configForm.controls;
  }

  get installConfigYaml(): string {
    return "" +
      "apiVersion: v1\n" +
      "metadata:\n" +
      "  name: " + this.controls.clusterName.value + "\n" +
      "baseDomain: " + this.controls.baseDomain.value + "\n" +
      "pullSecret: " + this.controls.pullSecret.value + "\n" +
      "sshKey: '" + this.controls.publicSshKey.value + "'\n" +
      "compute: \n" +
      "- name: worker\n" +
      "  replicas: 0 \n" +
      "controlPlane: \n" +
      "  name: master\n" +
      "  replicas: 1 \n" +
      "networking:\n" +
      "  clusterNetwork:\n" +
      "  - cidr: 10.128.0.0/14 \n" +
      "    hostPrefix: 23 \n" +
      "  networkType: OVNKubernetes \n" +
      "  serviceNetwork: \n" +
      "  - 172.30.0.0/16\n" +
      "platform:\n" +
      "  none: {} \n" +
      "fips: false \n";
  }

  get agentConfigYaml(): string {
    return "agent-config.yaml";
  }

}
