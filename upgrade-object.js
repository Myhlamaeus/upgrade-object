import upgradeFunction from 'upgrade-function'

export default function (obj, methods) {
  const ret = Object.create(Object.getPrototypeOf(obj))

  Object.getOwnPropertyNames(obj).forEach((propName) => {
    const propDesc = Object.getOwnPropertyDescriptor(obj, propName)

    if ('value' in propDesc) {
      if(typeof propDesc.value === 'function') {
        propDesc.value = propDesc.value.bind(obj)
      }
    } else if('get' in propDesc) {
      const originalGet = propDesc.get

      propDesc.get = function() {
        const val = originalGet.call(this)

        if (typeof val === 'function') {
          return val.bind(obj)
        }
        return val
      }
    }

    if (methods.indexOf(propName) !== -1) {
      if ('value' in propDesc) {
        if(typeof propDesc.value !== 'function') {
          throw new TypeError(`Property ${propName} is not a function`)
        }

        propDesc.value = upgradeFunction(propDesc.value)
      } else if('get' in propDesc) {
        const originalGet = propDesc.get

        propDesc.get = function() {
          const val = originalGet.call(this)

          if (typeof val !== 'function') {
            throw new TypeError(`Property ${propName} is not a function`)
          }
          return upgradeFunction(val)
        }
      }
    }
    Object.defineProperty(ret, propName, propDesc)
  })

  return ret
}
