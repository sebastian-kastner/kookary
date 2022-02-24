<!-- 
    Styling and layout taken from https://codepen.io/itsjustluck/pen/rMgRqL 
-->
<template>
  <div class="form-group typeahead">
    <input
      type="text"
      class="form-control typeahead-input"
      id="addFilter"
      autocomplete="off"
      v-model="internalValue"
      :disabled=disabled
    />
    <div class="typeahead-dropdown list-group">
      <div v-if="showSuggestions && addNewHandler" v-on:click="addNewItem">
        <a class="list-group-item">
          ➕ <span style="font-style: italic;">{{ internalValue }}</span>
        </a>
      </div>
      <div
        v-for="suggestion in suggestions"
        v-bind:key="getId(suggestion)"
        v-show="showSuggestions"
        v-on:click="onSuggestionSelected(suggestion)"
      >
        <a class="list-group-item">{{ getLabel(suggestion) }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class TypeaheadInput extends Vue {
  @Prop({ required: true }) data!: object[];
  @Prop({ required: false, default: "" }) value!: string;

  // eslint-disable-next-line
  @Prop({ required: true }) labelProvider!: (suggestion: any) => string;
  // eslint-disable-next-line
  @Prop({ required: true }) idProvider!: (suggestion: any) => string;

  @Prop({ required: false }) addNewHandler!: (name: string) => Promise<void>;

  internalValue = "";
  isSelected = false;

  mounted(): void {
    this.internalValue = this.value;
  }

  get disabled(): boolean {
      return this.isSelected;
  }

  get showSuggestions(): boolean {
    if (this.isSelected) {
      return false;
    }
    return this.internalValue.length > 0;
  }

  // eslint-disable-next-line
  get suggestions(): any[] {
    // eslint-disable-next-line
    const suggestions: any[] = [];
    if (!this.showSuggestions) {
      return suggestions;
    }

    this.data.forEach((suggestion) => {
      const label = this.getLabel(suggestion);

      if (label.toLowerCase().startsWith(this.internalValue.toLowerCase())) {
        suggestions.push(suggestion);
      }
    });

    return suggestions;
  }

  private getId(data: object): string {
    return this.idProvider(data);
  }

  private getLabel(data: object): string {
    return this.labelProvider(data);
  }

  // eslint-disable-next-line
  private onSuggestionSelected(suggestion: any) {
    this.internalValue = this.getLabel(suggestion);
    this.isSelected = true;
    this.$emit("onSuggestionSelected", suggestion);
  }

  private async addNewItem(): Promise<void> {
      // make sure the item to add does not exist yet
      for(let i=0;i<this.data.length;i++) {
          const suggestion = this.data[i];
          if (this.getLabel(suggestion).toLowerCase() === this.internalValue.toLowerCase()) {
              this.onSuggestionSelected(suggestion);
              return;
          }
      }
      
      this.addNewHandler(this.internalValue).then(() => {
          this.isSelected = true;
      })
  }
}
</script>

<style lang="scss">
@mixin show-dropdown {
  z-index: 101;
  display: block;
}

a {
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
}

.input-inline-button {
  display: inline-block;
  position: absolute;
  z-index: 4;
  right: 0;
  top: 0;
  text-decoration: none;
  padding: 0.5em;
  color: #999;
}
.list-group-item {
  &.active {
    background: #eee;
    border-color: #eee;
    color: #333;
  }
}
.icon-plus {
  &:after {
    content: "➕";
  }
}

.typeahead {
  position: relative;
  .input-group-addon {
    &:after {
      content: ":";
      display: inline;
    }
  }
  &-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: -2px;
    transition-delay: 0.75s;
    transition: display 1s;
    &:hover {
      display: block;
    }
    > .list-group-item {
      &:first-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        &:not(:last-child) {
          border-radius: 0;
        }
      }
    }
    &:focus {
      @include show-dropdown;
    }
  }
  &-input {
    z-index: 1;
    position: relative;
    &.form-control {
      //   border-top-right-radius: $input-border-radius !important;
      //   border-bottom-right-radius: $input-border-radius !important;
    }
    &:focus {
      z-index: 3;
      padding-bottom: 8px;
      height: 36px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0 !important;
      + .typeahead-dropdown {
        @include show-dropdown;
      }
    }
  }
  &-input-filter {
    // display: inline-block;
    // border: 1px solid;
    // @extend .input-group-addon ;
  }
}
</style>