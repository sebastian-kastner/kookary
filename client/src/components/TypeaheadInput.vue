<!-- 
    Styling and layout taken from https://codepen.io/itsjustluck/pen/rMgRqL 
    When migrating to vue3, consider using: https://github.com/frikinside/vue3-simple-typeahead 
-->
<template>
  <div class="form-group typeahead">
    <input
      type="text"
      class="form-control typeahead-input"
      id="addFilter"
      autocomplete="off"
      v-model="internalValue"
      v-on:keyup="onValueChange"
      :disabled=isDisabled
      @keydown.down.prevent="onArrowDown"
			@keydown.up.prevent="onArrowUp"
			@keydown.enter.tab.prevent="selectCurrentSelection"
    />
    <div class="typeahead-dropdown list-group">
      <div v-if="showSuggestions > 0 && addNewHandler" v-on:click="addNewItem">
        <a class="list-group-item" :class="activeIndex === ADD_SUGGESTION_INDEX ? 'active' : ''">
          ➕ <span style="font-style: italic;">{{ internalValue }}</span>
        </a>
      </div>
      <div
        class="typeahead-suggestion"
        v-for="(suggestion, index) in suggestions"
        v-bind:key="suggestion.id"
        v-show="suggestions.length > 0"
        v-on:click="onSuggestionSelected(suggestion.data)"
      >
        <a class="list-group-item" :class="activeIndex === index ? 'active' : ''">
          {{ suggestion.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

type Suggestion = {
  label: string,
  id: string,
  // eslint-disable-next-line
  data: any,
}

@Component({
  components: {},
})
export default class TypeaheadInput extends Vue {
  @Prop({ required: true }) data!: object[];
  @Prop({ required: false, default: "" }) value!: string;

  @Prop({ required: false, default: false }) isDisabled!: false;

  // eslint-disable-next-line
  @Prop({ required: true }) labelProvider!: (suggestion: any) => string;
  // eslint-disable-next-line
  @Prop({ required: true }) idProvider!: (suggestion: any) => string;

  @Prop({ required: false }) addNewHandler!: (name: string) => Promise<void>;

  DEFAULT_SUGGESTION_INDEX = -2;
  ADD_SUGGESTION_INDEX = -1;

  internalValue = "";
  activeIndex = this.DEFAULT_SUGGESTION_INDEX;
  suggestions: Suggestion[] = [];
  oldValue = "";
  showSuggestions = false;

  mounted(): void {
    this.internalValue = this.value;
    this.oldValue = this.internalValue;
    console.log(this.isDisabled)
  }

  private onValueChange(): void {
    if(this.oldValue == this.internalValue) {
      return;
    }
    
    if(!this.isDisabled && this.internalValue.length > 1) {
      const suggestions: Suggestion[] = [];
      for(let i=0; i < this.data.length; i++) {
        const label = this.getLabel(this.data[i]);
        if (label.toLowerCase().startsWith(this.internalValue.toLowerCase())) {
          const suggestion: Suggestion = {
            label,
            id: this.getId(this.data[i]),
            data: this.data[i]
          }
          suggestions.push(suggestion);
        }
      }
      this.suggestions = suggestions;
      this.showSuggestions = true;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }

    this.activeIndex = this.DEFAULT_SUGGESTION_INDEX;
    this.oldValue = this.internalValue;
  }


  private getId(data: object): string {
    return this.idProvider(data);
  }

  private getLabel(data: object): string {
    return this.labelProvider(data);
  }

  private onArrowDown(): void {
    const oldIndex = this.activeIndex;
    let newIndex = oldIndex + 1;
    if (newIndex <= (this.suggestions.length - 1)) {
      this.activeIndex = newIndex;
    }
  }

  private onArrowUp(): void {
    const oldIndex = this.activeIndex;
    let newIndex = oldIndex -1;
    if (newIndex >= this.DEFAULT_SUGGESTION_INDEX) {
      this.activeIndex = newIndex
    }
  }

  private selectCurrentSelection(): void {
    if (this.activeIndex !== this.DEFAULT_SUGGESTION_INDEX) {
      if(this.activeIndex === this.ADD_SUGGESTION_INDEX) {
        this.addNewItem();
      } else {
        this.onSuggestionSelected(this.suggestions[this.activeIndex].data);
      }
      this.activeIndex = this.DEFAULT_SUGGESTION_INDEX;
    }
  }

  // eslint-disable-next-line
  private onSuggestionSelected(suggestion: any) {
    this.internalValue = this.getLabel(suggestion);
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
          // do we need error handling here?
      })
  }
}
</script>

<style lang="scss">
@mixin show-dropdown {
  z-index: 101;
  display: block
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
      content: ':';
      display: inline;
    }
  }
  &-dropdown {
    display: none;
    // border-top: 1px solid #aaa;
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
      // border-top-right-radius: $input-border-radius !important;
      // border-bottom-right-radius: $input-border-radius !important;
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