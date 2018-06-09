import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router'
import { Injectable } from '@angular/core';
import * as Materialize from 'angular2-materialize'

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})

export class GoogleComponent {
  title: string = 'Google Maps';
  lat: string | number = 9.9923673;
  lng: string | number = -84.1241387;
  tipo: string = 'roadmap';
  latitud: any
  longitud: any

  @ViewChild('Labellatitud')
  private Labellatitud: ElementRef

  @ViewChild('Labellongitud')
  private Labellongitud: ElementRef

  @ViewChild('inputlatitud')
  private inputlatitud: ElementRef

  @ViewChild('inputlongitud')
  private inputlongitud: ElementRef

  @ViewChild('inputmapa')
  private inputmapa: ElementRef

  constructor(private renderer2: Renderer2) { }

  ngOnInit() {
    $('.modal').modal()
  }

  modal1() {
    this.LimpiarGuardar()
    $('#modal1').modal('open')
  }

  ValidateForm() {
    if (this.inputlatitud.nativeElement.value == '')
      return false
    if (this.inputlongitud.nativeElement.value == '')
      return false
    return true
  }

  LimpiarGuardar() {
    $('#FormAgregar').trigger("reset")
  }

  Submit() {

    if (this.ValidateForm()) {
      this.lat = Number($('#latitud').val())
      this.lng = Number($('#longitud').val())
      $('#modal1').modal('close');
    }
    else {
      Materialize.toast('Complete los espacios para continuar', 3000, 'red rounded')
    }
  }
  proarinsa(){
    this.lat = 9.9923673;
    this.lng = -84.1241387;
  }

}